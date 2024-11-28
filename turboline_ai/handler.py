import json
import os
import openai
from jupyter_server.base.handlers import APIHandler
import tornado
from dotenv import load_dotenv

# Load environment variables from a .env file, if present
load_dotenv()

class TurbolineAIHandler(APIHandler):
    # Add this line to enable XSRF protection
    def check_xsrf_cookie(self):
        pass
        
    @tornado.web.authenticated
    async def post(self):
        try:
            data = json.loads(self.request.body.decode('utf-8'))
            prompt = data.get('prompt', '').strip()

            if not prompt:
                self.set_status(400)
                self.finish(json.dumps({'error': 'No prompt provided.'}))
                return

            # Set OpenAI API key
            openai.api_key = os.getenv('OPENAI_API_KEY')

            if not openai.api_key:
                self.set_status(500)
                self.finish(json.dumps({'error': 'OpenAI API key not set.'}))
                return

            # Call OpenAI API
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=500,
                n=1,
                stop=None,
                temperature=0.7,
            )

            code = response.choices[0].text.strip()

            # Optional: Add parsing logic here to clean the code
            self.finish(json.dumps({'code': code}))
        except Exception as e:
            self.set_status(500)
            self.finish(json.dumps({'error': str(e)}))