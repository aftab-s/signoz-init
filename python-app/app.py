# app.py
from flask import Flask
import logging
import time

# OpenTelemetry Imports
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor

# Configure resource for our service
# 'my-python-app' will appear as the service name in SigNoz
resource = Resource.create({
    "service.name": "my-python-app",
    "service.version": "1.0.0",
    "environment": "development"
})

# Set up TracerProvider
provider = TracerProvider(resource=resource)
# Configure the OTLP HTTP Exporter to send data to SigNoz OTel Collector
# SigNoz OTel Collector listens on port 4318 for HTTP OTLP
span_exporter = OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces")
processor = BatchSpanProcessor(span_exporter)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Auto-instrument Flask and logging
FlaskInstrumentor().instrument_app(app)
LoggingInstrumentor().instrument(set_logging_format=True, log_level=logging.INFO)


@app.route('/')
def hello_world():
    logger.info("Hello World endpoint accessed.")
    return 'Hello, World!'

@app.route('/slow')
def slow_endpoint():
    current_span = trace.get_current_span()
    current_span.set_attribute("http.route", "/slow")
    time.sleep(0.5) # Simulate some work
    logger.warning("Slow endpoint accessed.")
    return 'This was a slow response!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)