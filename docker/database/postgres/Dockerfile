FROM postgres:15-alpine

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

# Custom init scripts
COPY init/ /docker-entrypoint-initdb.d/

# Performance tuning
RUN echo "shared_buffers = 256MB" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "effective_cache_size = 768MB" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "work_mem = 16MB" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "maintenance_work_mem = 128MB" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "wal_buffers = 4MB" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "random_page_cost = 1.1" >> /usr/share/postgresql/postgresql.conf.sample && \
    echo "effective_io_concurrency = 200" >> /usr/share/postgresql/postgresql.conf.sample

EXPOSE 5432

CMD ["postgres"]
