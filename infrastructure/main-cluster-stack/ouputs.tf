output "kube_config" {
  value = azurerm_kubernetes_cluster.quotes-kc.kube_config

  sensitive = true
}