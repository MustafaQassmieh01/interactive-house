FROM python:3.12-slim

WORKDIR /app

COPY protocol.py hardw_bridge.py demo_bridge.py ./

ENV SERVER_HOST=localhost
ENV SERVER_PORT=5001

CMD ["python", "demo_bridge.py"]
