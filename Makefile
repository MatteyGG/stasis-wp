# ====== CONFIG ======
LOCAL_IMAGE   ?= stasis-wp:local
REGISTRY      ?= ghcr.io
OWNER         ?= matteygg
IMAGE_NAME    ?= stasis-web
TAG           ?= latest

REMOTE_IMAGE  := $(REGISTRY)/$(OWNER)/$(IMAGE_NAME):$(TAG)

# ====== PRETTY OUTPUT ======
RED    := \033[0;31m
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m

# ====== TARGETS ======
.PHONY: help build tag push publish run login images clean

help:
	@echo "$(GREEN)=== Make targets ===$(NC)"
	@echo "  make build        - build local image with buildx (--load) -> $(LOCAL_IMAGE)"
	@echo "  make tag          - tag local image -> $(REMOTE_IMAGE)"
	@echo "  make push         - push $(REMOTE_IMAGE) to GHCR"
	@echo "  make publish      - build + tag + push"
	@echo "  make run          - run $(REMOTE_IMAGE) locally (port 3000:3000)"
	@echo "  make login        - login to ghcr.io using GHCR_USER + GHCR_TOKEN env vars"
	@echo "  make images       - show relevant docker images"
	@echo "  make clean        - remove local tags (does NOT delete remote)"

build:
	@echo "$(YELLOW)Building: $(LOCAL_IMAGE)$(NC)"
	docker buildx build --load -t $(LOCAL_IMAGE) .

tag:
	@echo "$(YELLOW)Tagging: $(LOCAL_IMAGE) -> $(REMOTE_IMAGE)$(NC)"
	docker tag $(LOCAL_IMAGE) $(REMOTE_IMAGE)

push:
	@echo "$(YELLOW)Pushing: $(REMOTE_IMAGE)$(NC)"
	docker push $(REMOTE_IMAGE)

publish: build tag push
	@echo "$(GREEN)Done: published $(REMOTE_IMAGE)$(NC)"

run:
	@echo "$(YELLOW)Running: $(REMOTE_IMAGE) on http://localhost:3000$(NC)"
	docker run --rm -p 3000:3000 $(REMOTE_IMAGE)

login:
	@if [ -z "$(GHCR_USER)" ] || [ -z "$(GHCR_TOKEN)" ]; then \
		echo "$(RED)Set GHCR_USER and GHCR_TOKEN env vars first.$(NC)"; \
		echo "Example (PowerShell):"; \
		echo "  $$env:GHCR_USER=\"matteygg\"; $$env:GHCR_TOKEN=\"<token>\""; \
		exit 1; \
	fi
	@echo "$(YELLOW)Logging in to $(REGISTRY) as $(GHCR_USER)$(NC)"
	@echo "$(GHCR_TOKEN)" | docker login $(REGISTRY) -u "$(GHCR_USER)" --password-stdin

images:
	@docker images | grep -E "stasis-wp|$(IMAGE_NAME)" || true

clean:
	@echo "$(YELLOW)Removing local tags:$(NC) $(LOCAL_IMAGE) and $(REMOTE_IMAGE)"
	-@docker rmi $(REMOTE_IMAGE) 2>/dev/null || true
	-@docker rmi $(LOCAL_IMAGE) 2>/dev/null || true


# $env:GHCR_USER="matteygg"
# $env:GHCR_TOKEN="...PAT..."
# make login
# make publish