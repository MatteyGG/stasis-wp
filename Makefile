IMAGE_NAME = stasis-web
REGISTRY = ghcr.io/matteygg

# Цвета для красивого вывода
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m

menu:
	@echo "$(GREEN)=== Docker Build Menu ===$(NC)"
	@echo "1) Stage environment"
	@echo "2) Production environment"  
	@echo "3) Custom environment"
	@echo "4) Auto-version from git"
	@read -p "Select option [1-4]: " choice; \
	case $$choice in \
		1) $(MAKE) build-env ENV=stage;; \
		2) $(MAKE) build-env ENV=production;; \
		3) $(MAKE) custom-build;; \
		4) $(MAKE) auto-build;; \
		*) echo "$(RED)Invalid option$(NC)";; \
	esac

build-env:
	@read -p "Enter version for $(ENV) [current: v0.1.0]: " version; \
	if [ -z "$$version" ]; then version="v0.1.0"; fi; \
	echo "$(GREEN)Building for $(ENV), version $$version$(NC)"; \
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$$version-$(ENV) .

custom-build:
	@read -p "Enter environment: " env; \
	read -p "Enter version: " version; \
	echo "$(GREEN)Building for $$env, version $$version$(NC)"; \
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$$version-$$env .

auto-build:
	$(eval VERSION := v$(shell git describe --tags --always --abbrev=7))
	$(eval COMMIT_HASH := $(shell git rev-parse --short HEAD))
	@echo "$(YELLOW)Auto-detected: version $(VERSION), commit $(COMMIT_HASH)$(NC)"
	@read -p "Enter environment [stage]: " env; \
	if [ -z "$$env" ]; then env="stage"; fi; \
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$(VERSION)-$$env .

# Пуш с подтверждением
push-with-confirm:
	@docker images | grep $(IMAGE_NAME)
	@read -p "$(RED)Push these images? [y/N]: $(NC)" confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		$(MAKE) push; \
	else \
		echo "Push cancelled"; \
	fi

.PHONY: menu build-env custom-build auto-build push-with-confirm