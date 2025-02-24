from utils import BASE_DIR
from logging import Handler
from datetime import datetime
from typing_extensions import override

class Logger(Handler):
    log_path = None

    def __init__(self, filename=None):
        super().__init__()
        self.log_path = filename

    def log(self, message):
        if self.log_path is None: return

        with open(self.log_path, "a") as log:
            log.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")

    def clear_log(self):
        if self.log_path is None: return

        with open(self.log_path, "w") as log:
            log.write("")
    
    @override
    def emit(self, record):
        meta, message = "", record.getMessage()
        if '>>' in message: 
            meta, message = message.split('>>')
        
        # if record.exc_text:
        #     message += f"\n{record.exc_text}"
        
        # if record.exc_info:
        #     message += f"\n{record.exc_info}"
            
        self.log(f"[{record.levelname}][{record.pathname}] {meta}>> {message}")
        