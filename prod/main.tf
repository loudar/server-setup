terraform {
  required_providers {
    hcloud = {
      source = "hetznercloud/hcloud"
      version = "1.48.1"
    }
  }
}

variable "hcloud_token" {
  type = string
  sensitive = true
}

variable "server_name" {
  description = "The name of the Hetzner Cloud server"
  type        = string
}

variable "ssh_key_name" {
  description = "The name of the SSH key to use for the server"
  type        = string
}

variable "enable_backups" {
  description = "Whether to enable backups for the server"
  type        = bool
}

variable "server_location" {
  description = "The location of the server"
  type        = string
}

variable "access_ip" {
  description = "The IP of the accessing machine"
  type        = string
}

provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_firewall" "firewall_web" {
  name = "firewall-web"
  rule {
    direction = "in"
    protocol  = "icmp"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    description = "SSH"
    port      = "22"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    description = "HTTPS"
    port      = "443"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    description = "HTTP"
    port      = "80"
    source_ips = [
      "0.0.0.0/0",
      "::/0"
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    description = "Coolify"
    port      = "8000"
    source_ips = [
      var.access_ip,
    ]
  }
}

resource "hcloud_server" "hetzner_cx22" {
  name        = var.server_name
  depends_on = [hcloud_firewall.firewall_web]
  server_type = "cx22"
  keep_disk = true
  location = var.server_location
  image       = "docker-ce"
  ssh_keys = [var.ssh_key_name]
  backups = var.enable_backups
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
}

resource "hcloud_firewall_attachment" "firewall_attachment" {
  firewall_id = hcloud_firewall.firewall_web.id
  server_ids = [hcloud_server.hetzner_cx22.id]
}
