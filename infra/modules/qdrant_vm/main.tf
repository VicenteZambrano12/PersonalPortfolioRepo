# Read-only lookup: the VM itself (and its idle-shutdown startup script)
# is created/owned by the BasicRAGapp repo's Terraform state. We never
# declare a google_compute_instance resource for it here, so this module
# can't accidentally take ownership of (or conflict with) someone else's
# infrastructure.
data "google_compute_instance" "qdrant" {
  project = var.project_id
  zone    = var.zone
  name    = var.vm_name
}
