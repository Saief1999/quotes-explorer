output "kube_config" {
  value = azurerm_kubernetes_cluster.quotes-kc.kube_config

  sensitive = true
}

# output "ingress-namesapce-id" {
#   description = "namsepace ID"
#   value       = kubernetes_namespace.quotes-ingress-namespace.id
# }

