data "terraform_remote_state" "quotes-aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "devbackrg"
    storage_account_name = "devbackstoracc"
    container_name       = "devbackstorcont"
    key                  = "main-cluster.terraform.tfstate"
  }
}

resource "kubernetes_namespace" "quotes-microservices-namespace" {
  metadata {
    name = "${var.environment}-microservices-namespace"
  }
}


# resource "helm_release" "quotes-microservices" {
#   name      = "${local.env_prefix}-microservices"
#   chart     = "${path.module}/chart"
#   namespace = kubernetes_namespace.quotes-microservices-namespace.id
# }
