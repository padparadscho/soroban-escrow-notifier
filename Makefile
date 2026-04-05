.PHONY: install dev build-local start-local build run stop logs clean migrate migrate-down migrate-list lint lint-fix format format-check

IMAGE_NAME := soroban-escrow-notifier
CONTAINER_NAME := soroban-escrow-notifier-container

install:
	pnpm install

dev:
	pnpm run dev

build-local:
	pnpm run build

start-local: build-local
	pnpm start

build:
	docker build -t $(IMAGE_NAME) .

run: build
	docker run -d --env-file .env --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

logs:
	docker logs -f $(CONTAINER_NAME)

clean: stop
	docker rmi $(IMAGE_NAME)

migrate:
	pnpm run migrate

migrate-down:
	pnpm run migrate:down

migrate-list:
	pnpm run migrate:list

lint:
	pnpm run lint

lint-fix:
	pnpm run lint:fix

format:
	pnpm run format

format-check:
	pnpm run format:check