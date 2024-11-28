import os
from ._version import __version__
from .handler import TurbolineAIHandler
from jupyter_server.serverapp import ServerApp
from copier import run_copy

def _jupyter_server_extension_paths():
    return [{
        "module": "turboline_ai"
    }]

def load_jupyter_server_extension(server_app: ServerApp):
    web_app = server_app.web_app
    host_pattern = ".*$"
    route_pattern = "/turboline-ai/generate"
    web_app.add_handlers(host_pattern, [(route_pattern, TurbolineAIHandler)])