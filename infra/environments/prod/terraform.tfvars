# qdrant_vm_name is intentionally left unset here - it identifies a VM
# owned by a separate repo/Terraform state. Provide it the same way other
# environment-specific values flow in (TF_VAR_qdrant_vm_name in CI, or a
# local, gitignored *.auto.tfvars / exported env var), mirroring whatever
# value the backend's .env uses to resolve the Qdrant host.
# qdrant_vm_name = "qdrant-vm"