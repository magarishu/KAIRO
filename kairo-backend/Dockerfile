FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build API and Engine
RUN CGO_ENABLED=0 GOOS=linux go build -o /api ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o /engine ./cmd/engine

FROM alpine:latest
WORKDIR /app
COPY --from=builder /api /app/api
COPY --from=builder /engine /app/engine

# Set default command or rely on docker-compose to override
CMD ["/app/api"]
