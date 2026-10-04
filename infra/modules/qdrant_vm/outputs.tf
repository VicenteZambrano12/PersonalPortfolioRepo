output "qdrant_internal_ip" {
  value = data.google_compute_instance.qdrant.network_interface[0].network_ip
}

output "vm_name" {
  value = var.vm_name
}

output "zone" {
  value = var.zone
}
