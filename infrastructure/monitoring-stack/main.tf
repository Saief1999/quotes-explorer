data "terraform_remote_state" "quotes-aks" {
  backend = "azurerm"

  config = {
    resource_group_name  = "devbackrg"
    storage_account_name = "devbackstoracc"
    container_name       = "devbackstorcont"
    key                  = "main-cluster.terraform.tfstate"
  }
}


resource "kubernetes_namespace" "quotes-monitoring-namespace" {
  metadata {
    name = "${var.environment}-monitoring-namespace"
  }
}



resource "helm_release" "quotes-prometheus" {
  name       = "${local.env_prefix}-prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.quotes-monitoring-namespace.id
}

data "template_file" "quotes-datadog-template" {
  template = file("${path.module}/config/datadog-values.yaml")
  vars = {
    "apiKey" = "${var.datadog_api_key}"
  }
}

resource "helm_release" "quotes-datadog" {
  name       = "${local.env_prefix}-datadog"
  repository = "https://helm.datadoghq.com"
  chart      = "datadog"
  values     = [data.template_file.quotes-datadog-template.rendered]
  namespace  = kubernetes_namespace.quotes-monitoring-namespace.id
}
