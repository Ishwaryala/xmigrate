from __main__ import app
import os
import json
from quart import jsonify, request
from pkg.azure import location
from pkg.aws import location as regions
from pkg.gcp import location as gcpregions
from quart_jwt_extended import jwt_required, get_jwt_identity


@app.route('/locations/get', methods=['POST'])
@jwt_required
async def locations_get():
    if request.method == 'POST':
        data = await request.get_json()
        provider = data['provider']
        if provider == 'azure':
            subscription_id,client_id,secret,tenant_id = data['subscription_id'], data['client_id'], data['secret_id'], data['tenant_id']
            locations, flag = location.get_locations(subscription_id,client_id,secret,tenant_id)
            if flag:
                return jsonify({'status': '200', 'locations': locations})
            else:
                return jsonify({'status': '500', 'locations': locations, 'message':"wrong credentials"})
        elif provider == 'aws':
            access_key, secret_key = data['access_key'], data['secret_key']
            locations, flag = regions.get_locations(access_key,secret_key)
            if flag:
                return jsonify({'status': '200', 'locations': locations})
            else:
                return jsonify({'status': '500', 'locations': locations, 'message':"wrong credentials"})
        elif provider == 'gcp':
            service_account = data['service_account']
            project_id = data['project_id']
            regions, flag = gcpregions.get_regions(service_account, project_id)
            if flag:
                return jsonify({'status': '200', 'locations': regions})
            else:
                return jsonify({'status': '500', 'locations': regions, 'message':"wrong credentials"})
