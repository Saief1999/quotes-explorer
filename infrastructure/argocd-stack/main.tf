data "terraform_remote_state" "quotes-aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "devbackrg"
    storage_account_name = "devbackstoracc"
    container_name       = "devbackstorcont"
    key                  = "main-cluster.terraform.tfstate"
  }
}

resource "kubernetes_namespace" "quotes-argocd-namespace" {
  metadata {
    name = "${var.environment}-argocd-namespace"
  }
}

resource "helm_release" "argo" {
  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.quotes-argocd-namespace.id
}
