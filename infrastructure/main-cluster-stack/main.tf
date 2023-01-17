# Create a resource group
resource "azurerm_resource_group" "quotes-rg" {
  name     = "${local.env_prefix}-rg"
  location = "West Europe"
}

resource "azurerm_kubernetes_cluster" "quotes-kc" {
  name                = "${local.env_prefix}-kc"
  location            = azurerm_resource_group.quotes-rg.location
  resource_group_name = azurerm_resource_group.quotes-rg.name
  dns_prefix          = "${local.env_prefix}-aks1"

  sku_tier = "Free"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_D2_v2"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    Environment = var.environment
  }
}

resource "kubernetes_namespace" "quotes-ingress-namespace" {
  metadata {
    name = "${var.environment}-ingress-namespace"
  }
}

resource "helm_release" "quotes-ingress" {
  name       = "${local.env_prefix}-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.quotes-ingress-namespace.id
  values = [file("${path.module}/config/nginx-values.yaml")]
}
