output "backend_rg" {
  value = azurerm_resource_group.backend-rg.name
}

output "backend_storage_account_name" {
  value = azurerm_storage_account.backend-storage-account.name
}

output "backend_storage_container_name" {
  value = azurerm_storage_container.backend-storage-container.name
}