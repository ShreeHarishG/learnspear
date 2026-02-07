from odoo import http, SUPERUSER_ID
from odoo.http import request, Response
from odoo.tools import json_default
import json
import logging

_logger = logging.getLogger(__name__)

class SubscriptionAPI(http.Controller):

    # =========================================================
    # HELPER FUNCTIONS
    # =========================================================

    def _json_response(self, data, status=200):
        return Response(
            json.dumps({'status': 'success', 'data': data}, default=json_default),
            status=status,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        )

    def _error_response(self, message, status=400):
        return Response(
            json.dumps({'status': 'error', 'message': message}, default=json_default),
            status=status,
            headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        )

    def _handle_options(self):
        return Response(status=200, headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        })

    # =========================================================
    # 1. AUTH & USER MANAGEMENT
    # =========================================================

    @http.route('/api/auth/clerk_sync', type='json', auth='none', cors='*', csrf=False)
    def clerk_sync(self, email, secret_key):
        if secret_key != 'your_shared_secret': return {'error': 'Unauthorized'}
        try:
            env = request.env(user=SUPERUSER_ID)
            User = env['res.users'].with_context(active_test=False)
            user = User.search([('login', '=', email)], limit=1)

            if user:
                if not user.active: user.write({'active': True})
            else:
                with env.cr.savepoint():
                    Partner = env['res.partner']
                    partner = Partner.search([('email', '=', email)], limit=1)
                    company = env['res.company'].search([], limit=1)
                    
                    if not partner:
                        partner = Partner.create({'name': email.split('@')[0], 'email': email, 'customer_rank': 1, 'company_id': company.id})
                    else:
                        if not partner.company_id: partner.write({'company_id': company.id})
                    
                    portal_group = env.ref('base.group_portal', raise_if_not_found=False)
                    groups = [(6, 0, [portal_group.id])] if portal_group else []

                    user = User.create({
                        'name': partner.name, 'login': email, 'partner_id': partner.id,
                        'active': True, 'groups_id': groups, 'company_id': company.id, 'company_ids': [(4, company.id)]
                    })
                    env.cr.flush()
            
            return {'status': 'success', 'uid': user.id, 'name': user.name, 'partner_id': user.partner_id.id, 'session_id': request.session.sid}
        except Exception as e:
            return {'error': str(e)}

    @http.route('/api/users', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_all_users(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        try:
            users = request.env['res.users'].sudo().search_read([], ['id', 'name', 'login', 'active', 'partner_id'])
            return self._json_response(users)
        except Exception as e:
             return self._error_response(str(e))

    # =========================================================
    # 2. DASHBOARD & STATS
    # =========================================================

    @http.route('/api/stats', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_stats(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        try: sub_count = request.env['subscription.subscription'].sudo().search_count([('state', '=', 'active')])
        except: sub_count = 0
        try: inv_total = sum(request.env['account.move'].sudo().search([('move_type', '=', 'out_invoice'), ('state', '=', 'posted')]).mapped('amount_total'))
        except: inv_total = 0.0
        try: cust_count = request.env['res.partner'].sudo().search_count([('customer_rank', '>', 0)])
        except: cust_count = 0
        try: order_count = request.env['sale.order'].sudo().search_count([('state', '=', 'sale')])
        except: order_count = 0
        
        return self._json_response({
            'active_subscriptions': sub_count,
            'total_revenue': inv_total,
            'total_customers': cust_count,
            'total_orders': order_count
        })

    # =========================================================
    # 3. PRODUCTS (FIXED)
    # =========================================================

    @http.route('/api/products', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_products(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        
        if request.httprequest.method == 'GET':
            try:
                data = request.env['product.product'].sudo().search_read(
                    [('sale_ok', '=', True)], 
                    ['id', 'name', 'list_price', 'description_sale', 'default_code', 'image_1920', 'categ_id']
                )
                return self._json_response(data)
            except:
                return self._json_response([])
        
        try:
            params = json.loads(request.httprequest.data)
            new_product = request.env['product.product'].sudo().create({
                'name': params.get('name'),
                'list_price': params.get('price'),
                'detailed_type': params.get('type', 'service'),
            })
            return self._json_response({'id': new_product.id, 'message': 'Product Created'})
        except Exception as e:
            return self._error_response(str(e))

    @http.route('/api/products/<int:id>', type='http', auth='public', methods=['GET', 'DELETE', 'OPTIONS'], csrf=False)
    def product_detail(self, id):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        
        if request.httprequest.method == 'DELETE':
            try:
                request.env['product.product'].sudo().browse(id).unlink()
                return self._json_response({'message': 'Deleted'})
            except:
                return self._error_response('Could not delete')
        
        # --- FIX: Added image_1920 and categ_id ---
        data = request.env['product.product'].sudo().search_read(
            [('id', '=', id)], 
            ['id', 'name', 'list_price', 'description_sale', 'default_code', 'image_1920', 'categ_id']
        )
        return self._json_response(data[0] if data else {})

    # =========================================================
    # 4. ORDERS
    # =========================================================

    @http.route('/api/orders', type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_orders(self, partner_id=None, state=None):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()

        if request.httprequest.method == 'POST':
            try:
                data = json.loads(request.httprequest.data)
                order = request.env['sale.order'].sudo().create({
                    'partner_id': int(data['partner_id']),
                    'order_line': [(0, 0, {'product_id': line['product_id'], 'product_uom_qty': line['qty']}) for line in data['lines']]
                })
                return self._json_response({'id': order.id, 'name': order.name})
            except Exception as e:
                return self._error_response(str(e))

        domain = []
        if partner_id: domain.append(('partner_id', '=', int(partner_id)))
        if state == 'quotation': domain.append(('state', 'in', ['draft', 'sent']))
        elif state == 'sale': domain.append(('state', 'in', ['sale', 'done']))
        
        try:
            data = request.env['sale.order'].sudo().search_read(domain, ['id', 'name', 'date_order', 'state', 'amount_total', 'partner_id'])
            return self._json_response(data)
        except:
             return self._json_response([])

    # =========================================================
    # 5. INVOICES & PAYMENTS
    # =========================================================

    @http.route('/api/invoices', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_invoices(self, partner_id=None):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        domain = [('move_type', '=', 'out_invoice')]
        if partner_id: domain.append(('partner_id', '=', int(partner_id)))
        data = request.env['account.move'].sudo().search_read(domain, ['id', 'name', 'invoice_date', 'payment_state', 'amount_total', 'state', 'partner_id'])
        return self._json_response(data)

    @http.route('/api/invoices/<int:id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def invoice_detail(self, id):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        inv = request.env['account.move'].sudo().browse(id)
        if not inv.exists(): return self._error_response('Not Found', 404)
        
        data = {
            'id': inv.id, 'name': inv.name, 'state': inv.state, 'amount_total': inv.amount_total,
            'lines': [{'name': l.name, 'qty': l.quantity, 'price': l.price_unit, 'subtotal': l.price_subtotal} for l in inv.invoice_line_ids]
        }
        return self._json_response(data)

    @http.route('/api/payments', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_payments(self, partner_id=None):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        domain = []
        if partner_id: domain.append(('partner_id', '=', int(partner_id)))
        data = request.env['account.payment'].sudo().search_read(domain, ['id', 'name', 'date', 'amount', 'state', 'partner_id'])
        return self._json_response(data)

    # =========================================================
    # 6. SUBSCRIPTIONS
    # =========================================================

    @http.route('/api/subscriptions', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_subscriptions(self, partner_id=None):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        domain = []
        if partner_id: domain.append(('partner_id', '=', int(partner_id)))
        try:
            data = request.env['subscription.subscription'].sudo().search_read(domain, ['id', 'name', 'partner_id', 'state', 'amount_total'])
        except:
            data = [] 
        return self._json_response(data)

    # =========================================================
    # 7. MISC
    # =========================================================

    @http.route('/api/plans', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_plans(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        try: plans = request.env['subscription.plan'].sudo().search_read([], ['id', 'name']) 
        except: plans = []
        return self._json_response(plans)

    @http.route('/api/taxes', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_taxes(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        data = request.env['account.tax'].sudo().search_read([('type_tax_use', '=', 'sale')], ['id', 'name', 'amount'])
        return self._json_response(data)

    @http.route('/api/discounts', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_discounts(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        try: data = request.env['product.pricelist'].sudo().search_read([], ['id', 'name', 'currency_id'])
        except: data = []
        return self._json_response(data)

    @http.route('/api/me', type='http', auth='user', methods=['GET', 'OPTIONS'], csrf=False)
    def get_my_profile(self):
        if request.httprequest.method == 'OPTIONS': return self._handle_options()
        user = request.env.user
        partner = user.partner_id
        return self._json_response({
            'uid': user.id,
            'name': partner.name,
            'email': partner.email,
            'phone': partner.phone,
            'street': partner.street,
            'city': partner.city,
            'partner_id': partner.id
        })
