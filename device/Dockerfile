FROM python:3.12-slim

WORKDIR /app

COPY protocol.py hardw_bridge.py ./

ENV SERVER_HOST=localhost
ENV SERVER_PORT=5001

CMD ["sh", "-c", "python hardw_bridge.py --simulate --server \"$SERVER_HOST\" --server-port \"$SERVER_PORT\""]
