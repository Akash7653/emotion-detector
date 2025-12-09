import base64, json, urllib.request, io, sys
from PIL import Image

# create a 48x48 gray image
img = Image.new('RGB', (48,48), color=(128,128,128))
buf = io.BytesIO()
img.save(buf, format='JPEG')
b64 = base64.b64encode(buf.getvalue()).decode()
dataurl = 'data:image/jpeg;base64,' + b64

payload = json.dumps({'image': dataurl}).encode('utf-8')
req = urllib.request.Request('https://emotions-tt57.onrender.com/api/detect-emotion', data=payload, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('STATUS', resp.status)
        body = resp.read().decode('utf-8')
        print('BODY', body)
except Exception as e:
    print('ERROR', e)
    sys.exit(1)
