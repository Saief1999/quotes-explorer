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

data "template_file" "quotes-argocd-config" {
  template = file("${path.module}/config/argocd.yaml")
  vars = {
    "env" = "${var.environment}"
  }
}

resource "helm_release" "quotes-argocd-app" {
  name      = "${local.env_prefix}-argocd-chart"
  chart     = "${path.module}/chart"
  namespace = kubernetes_namespace.quotes-argocd-namespace.id
  values    = [data.template_file.quotes-argocd-config.rendered]
}

data "template_file" "quotes-monitoring-ingress" {
  template = file("${path.module}/config/ingress.yaml")
  vars = {
    "env" = "${var.environment}"
  }
}

resource "kubectl_manifest" "quotes-monitoring-ingress-manifest" {
  yaml_body          = data.template_file.quotes-monitoring-ingress.rendered
  override_namespace = kubernetes_namespace.quotes-argocd-namespace.id
}
