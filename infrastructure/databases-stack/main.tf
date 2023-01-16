data "terraform_remote_state" "quotes-aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "devbackrg"
    storage_account_name = "devbackstoracc"
    container_name       = "devbackstorcont"
    key                  = "main-cluster.terraform.tfstate"
  }
}

resource "kubernetes_namespace" "quotes-databases-namespace" {
  metadata {
    name = "${var.environment}-databases-namespace"
  }
}


resource "helm_release" "quotes-mongodb" {
  name       = "${local.env_prefix}-mongodb"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "mongodb"
  namespace  = kubernetes_namespace.quotes-databases-namespace.id
  values = [file("${path.module}/config/mongodb-values.yaml")]
}
