import flask, sys, os
import requests
from flask import Flask, jsonify, request, session, render_template, url_for, redirect

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.secret_key = 'celeron0912'
api_url = 'https://waterbillingapi.herokuapp.com'


# app.config['SESSION_TYPE'] = 'filesystem'

@app.route('/')
def index():
    if session.get('user') == None:
        return render_template("index.html")
    else:
        return redirect(url_for('consumer_dash'))


@app.route('/administrator')
def admin_dash():
    if session.get('user') == None:
        return render_template('index.html')
    else:
        return render_template("homepage_admin.html", firstname=str(session['firstname']),
                               lastname=str(session['lastname']))


@app.route('/payment')
def payment():
    if session.get('user') == None:
        return render_template('index.html')
    else:
        return render_template("payment_admin.html", firstname=str(session['firstname']),
                               lastname=str(session['lastname']))


@app.route('/dashboard')
def consumer_dash():
    if session.get('user') == None:
        return render_template('index.html')
    elif str(session['admin_prev']) == 'False':
        resp2 = requests.get(api_url+"/bill/user/" + session['user'])
        cur_user = resp2.json()
        return render_template('latestdash_consumer.html', b_info=cur_user['entries'],
                               firstname=str(session['firstname']), lastname=str(session['lastname']))
    else:
        return redirect(url_for('admin_dash', firstname=str(session['firstname']), lastname=str(session['lastname'])))


@app.route('/billmonth')
def bill_month():
    if session.get('user') == None:
        return render_template('index.html')
    else:
        return render_template("homepage_consumer.html", firstname=str(session['firstname']),
                               lastname=str(session['lastname']), curuser=str(session['user']))


@app.route('/addbill')
def admin_addbill():
    resp2 = requests.get(api_url+"/date/distinct")
    resp3 = requests.get(api_url+"/bill/date/max")
    json_resp = resp2.json()
    json_resp2 = resp3.json()
    max_date = json_resp2['entries'][0]["max_date"]
    bill_dates = json_resp['entries']
    return render_template("new_addbill.html", firstname=str(session['firstname']), lastname=str(session['lastname']),
                           bill_date=bill_dates, date_filter=max_date)


@app.route('/sms-blast')
def admin_sms():
    resp2 = requests.get(api_url+"/date/distinct")
    json_resp = resp2.json()
    bill_dates = json_resp['entries']
    return render_template("sms_admin.html", firstname=str(session['firstname']), lastname=str(session['lastname']),
                           bill_date=bill_dates)


@app.route('/activation/status')
def activation_status():
    return render_template("admin_activation_status.html", firstname=str(session['firstname']),
                           lastname=str(session['lastname']))


@app.route('/search/user')
def search_user():
    return render_template("search_admin.html", firstname=str(session['firstname']), lastname=str(session['lastname']))


@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('firstname', None)
    session.pop('lastname', None)
    session.pop('admin_prev', None)
    session.pop('mobile_num', None)
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    params = request.get_json()
    username = params["username"]
    password = params["password"]
    headers = {'content-type': 'application/json; charset=utf-8', 'dataType': "json"}
    resp = requests.post(api_url+"/login", headers=headers,
                         json={'username': username, 'password': password})
    data = resp.json()
    if "error" in data['status']:
        return jsonify(resp.json())
    else:
        resp2 = requests.get(api_url+"/user/" + data['status'])
        cur_user = resp2.json()
        session['firstname'] = cur_user['entries'][0]['firstname']
        session['lastname'] = cur_user['entries'][0]['lastname']
        session['mobile_num'] = cur_user['entries'][0]['mobile_number']
        session['admin_prev'] = cur_user['entries'][0]['admin_prev']
        session['user'] = data['status']
        return jsonify(resp.json())


@app.route('/register', methods=['POST'])
def register():
    params = request.get_json()
    rusername = params["rusername"]
    password = params["password"]
    reg_key = params["regkey"]
    mobile = params["mobile"]

    headers = {'content-type': 'application/json; charset=utf-8', 'dataType': "json"}
    resp = requests.post(api_url+"/register", headers=headers,
                         json={'username': rusername, 'password': password,
                               'reg_key': reg_key, 'number': mobile})
    data = resp.json()
    if "error" in data['status']:
        return jsonify(resp.json())
    else:
        resp2 = requests.get(api_url+"/user/" + data['user'])
        cur_user = resp2.json()
        session['firstname'] = cur_user['entries'][0]['firstname']
        session['lastname'] = cur_user['entries'][0]['lastname']
        session['admin_prev'] = cur_user['entries'][0]['admin_prev']
        session['user'] = data['user']
        return jsonify(resp.json())


@app.route('/settings')
def settings_con():
    return render_template("settings_consumer.html", firstname=str(session['firstname']),
                           lastname=str(session['lastname']), mobile=str(session['mobile_num']),curuser=session['user'])

@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get(
        'Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')

    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


if __name__ == '__main__':
    app.run(debug=True)
