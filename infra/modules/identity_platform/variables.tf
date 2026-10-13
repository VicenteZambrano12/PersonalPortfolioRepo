variable "project_id" {
  type        = string
  description = "Existing Google Cloud project in which to configure Identity Platform."
}

variable "authorized_domains" {
  type        = list(string)
  description = "Hostnames authorized for authentication redirects, without schemes or paths."
  default     = ["localhost"]
}
