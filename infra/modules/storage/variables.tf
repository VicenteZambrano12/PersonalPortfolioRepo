variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "bucket_name" {
  type        = string
  description = "Name of the general-purpose app storage bucket. Must be globally unique."
  default     = "basicragapp-storage"
}

variable "common_labels" {
  type = map(string)
}
