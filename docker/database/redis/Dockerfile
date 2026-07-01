FROM redis:7-alpine

# Copy production config
COPY conf/redis.conf /usr/local/etc/redis/redis.conf

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD redis-cli ping

EXPOSE 6379

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
