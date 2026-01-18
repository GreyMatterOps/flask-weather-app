import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
load_dotenv()

app=Flask(__name__)

API_KEY= os.getenv('OPENWEATHER_API_KEY')
BASE_URL='https://api.openweathermap.org/data/2.5/weather'

def get_weather(city):

    try: 
        params= {
            'q': city,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(BASE_URL,params=params)
        response.raise_for_status()

        data=response.json()

        weather_data={
            'city': data['name'],
            'country':data['sys']['country'],
            'temperature':data['main']['temp'],
            'feels_like':data['main']['feels_like'],
            'humidity':data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'description': data['weather'][0]['description'],
            'wind_speed': data['wind']['speed'],
            'cloudiness': data['clouds']['all']
        }
        return weather_data

    except requests.exceptions.HTTPError as e:
        if response.status_code == 404:
            return{'error':'City not found'}
        return {'error':f'API error: {response.status_code} '}
    except Exception as e:
        return{'error':str(e)}
    
    
@app.route('/api/weather',methods=['GET'])
def weather_api():
        
    city = request.args.get('city')

    if not city:
        return jsonify({'error': 'City parameter is required'}), 400
        
    if not API_KEY:
        return jsonify({'error':'API key not configured'}),500
        
    weather_data=get_weather(city)

    if 'error' in weather_data:
        return jsonify(weather_data),400
        
    return jsonify(weather_data),200
    
if __name__ == '__main__':
    app.run(debug=True)
    print("server started")