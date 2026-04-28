.PHONY: install dev build-local start-local typecheck build run stop logs clean generate-schema lint lint-fix format format-check

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

typecheck:
	pnpm run typecheck

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

generate-schema:
	pnpm run generate-schema

lint:
	pnpm run lint

lint-fix:
	pnpm run lint:fix

format:
	pnpm run format

format-check:
	pnpm run format:check
