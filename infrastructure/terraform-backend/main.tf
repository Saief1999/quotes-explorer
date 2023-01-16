resource "azurerm_resource_group" "backend-rg" {
  name     = "${local.env_prefix}rg"
  location = "West Europe"
}

resource "azurerm_storage_account" "backend-storage-account" {
  name                     = "${local.env_prefix}storacc"
  resource_group_name      = azurerm_resource_group.backend-rg.name
  location                 = azurerm_resource_group.backend-rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "backend-storage-container" {
  name                  = "${local.env_prefix}storcont"
  storage_account_name  = azurerm_storage_account.backend-storage-account.name
  container_access_type = "private"
}