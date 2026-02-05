
import json

raw_data = [
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-L2-R;REQ-SRV-NET-SW-L2" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-STP-R;REQ-SRV-NET-SW-STP" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-BPDU-R;REQ-SRV-NET-SW-BPDU" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-MACFLAP-R;REQ-SRV-NET-SW-MACFLAP" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-VLAN-R;REQ-SRV-NET-SW-VLAN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-TRUNK-R;REQ-SRV-NET-SW-TRUNK" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-PORTCHANNEL-R;REQ-SRV-NET-SW-PORTCHANNEL" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-DUPLEX-R;REQ-SRV-NET-SW-DUPLEX" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-POE-R;REQ-SRV-NET-SW-POE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-HARDWARE-R;REQ-SRV-NET-SW-HARDWARE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-AUTENTICACION-R;REQ-SRV-NET-WL-AUTENTICACION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-CONECTIVIDAD-R;REQ-SRV-NET-WL-CONECTIVIDAD" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-INTERFERENCIA-R;REQ-SRV-NET-WL-INTERFERENCIA" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-ROAMING-R;REQ-SRV-NET-WL-ROAMING" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-CAPACIDAD-R;REQ-SRV-NET-WL-CAPACIDAD" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-CONTROLLER-R;REQ-SRV-NET-WL-CONTROLLER" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-SSID-R;REQ-SRV-NET-WL-SSID" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-APDOWN-R;REQ-SRV-NET-WL-APDOWN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-CHANNEL-R;REQ-SRV-NET-WL-CHANNEL" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;NET-WL-FIRMWARE-R;REQ-SRV-NET-WL-FIRMWARE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-AUTENTICACION-R;REQ-SRV-ENT-ISE-AUTENTICACION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-AUTORICING-R;REQ-SRV-ENT-ISE-AUTORICING" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-PERFORMANCE-R;REQ-SRV-ENT-ISE-PERFORMANCE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-CERTIFICADOS-R;REQ-SRV-ENT-ISE-CERTIFICADOS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-POLICYSET-R;REQ-SRV-ENT-ISE-POLICYSET" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-AD-CONNECT-R;REQ-SRV-ENT-ISE-AD-CONNECT" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-RADIUS-R;REQ-SRV-ENT-ISE-RADIUS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-TACACS-R;REQ-SRV-ENT-ISE-TACACS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-PXE-R;REQ-SRV-ENT-ISE-PXE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-ISE-PROVISIONING-R;REQ-SRV-ENT-ISE-PROVISIONING" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-AUTENTICACION-R;REQ-SRV-ENT-AD-AUTENTICACION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-REPLICACION-R;REQ-SRV-ENT-AD-REPLICACION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-CUENTAS-R;REQ-SRV-ENT-AD-CUENTAS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-POLICIES-R;REQ-SRV-ENT-AD-POLICIES" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-GPO-R;REQ-SRV-ENT-AD-GPO" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-LDAP-R;REQ-SRV-ENT-AD-LDAP" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-DOMAINJOIN-R;REQ-SRV-ENT-AD-DOMAINJOIN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-DNS-R;REQ-SRV-ENT-AD-DNS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-SSO-R;REQ-SRV-ENT-AD-SSO" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-AD-TIME-R;REQ-SRV-ENT-AD-TIME" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-MAIL-ENTREGA-R;REQ-SRV-ENT-MAIL-ENTREGA" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-MAIL-SPAM-R;REQ-SRV-ENT-MAIL-SPAM" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-MAIL-BLACKLIST-R;REQ-SRV-ENT-MAIL-BLACKLIST" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-MAIL-AUTENTICACION-R;REQ-SRV-ENT-MAIL-AUTENTICACION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;ENT-MAIL-CUOTAS-R;REQ-SRV-ENT-MAIL-CUOTAS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-CONNECTIVITY-R;REQ-SRV-DC-ACI-CONNECTIVITY" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-CONF-R;REQ-SRV-DC-ACI-CONF" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-EPG-R;REQ-SRV-DC-ACI-EPG" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-BRIDGEDOMAIN-R;REQ-SRV-DC-ACI-BRIDGEDOMAIN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-CONTRACTS-R;REQ-SRV-DC-ACI-CONTRACTS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-FABRICHEALTH-R;REQ-SRV-DC-ACI-FABRICHEALTH" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-LEAFDOWN-R;REQ-SRV-DC-ACI-LEAFDOWN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-SPINECONN-R;REQ-SRV-DC-ACI-SPINECONN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-TEP-R;REQ-SRV-DC-ACI-TEP" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-POLICIES-R;REQ-SRV-DC-ACI-POLICIES" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-PERFORMANCE-R;REQ-SRV-DC-VM-PERFORMANCE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-CPU-R;REQ-SRV-DC-VM-CPU" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-MEMORIA-R;REQ-SRV-DC-VM-MEMORIA" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-STORAGE-R;REQ-SRV-DC-VM-STORAGE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-RED-R;REQ-SRV-DC-VM-RED" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-MIGRATION-R;REQ-SRV-DC-VM-MIGRATION" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-SNAPSHOT-R;REQ-SRV-DC-VM-SNAPSHOT" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-RESOURCEPOOL-R;REQ-SRV-DC-VM-RESOURCEPOOL" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-DNS-R;REQ-SRV-DC-VM-DNS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-VM-DRS-R;REQ-SRV-DC-VM-DRS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-LATENCIA-R;REQ-SRV-DC-SAN-LATENCIA" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-DISCO-R;REQ-SRV-DC-SAN-DISCO" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-DEGRADADO-R;REQ-SRV-DC-SAN-DEGRADADO" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-CACHE-R;REQ-SRV-DC-SAN-CACHE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-BACKUP-R;REQ-SRV-DC-SAN-BACKUP" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-NAS-CUOTAS-R;REQ-SRV-DC-NAS-CUOTAS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-NAS-PERFORMANCE-R;REQ-SRV-DC-NAS-PERFORMANCE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;DC-SAN-FIRMWARE-R;REQ-SRV-DC-SAN-FIRMWARE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-RULES-I;INC-SRV-SEC-FW-RULES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-DENY-I;INC-SRV-SEC-FW-DENY" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-ACL-I;INC-SRV-SEC-FW-ACL" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-VPN-I;INC-SRV-SEC-FW-VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-UPDATES-I;INC-SRV-SEC-FW-UPDATES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-AMP-MALWARE-I;INC-SRV-SEC-AMP-MALWARE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-AMP-POLICY-I;INC-SRV-SEC-AMP-POLICY" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-AMP-CUARENTENA-I;INC-SRV-SEC-AMP-CUARENTENA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-AMP-NUBE-I;INC-SRV-SEC-AMP-NUBE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-AMP-PERFORMANCE-I;INC-SRV-SEC-AMP-PERFORMANCE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-IAM-SSO-I;INC-SRV-SEC-IAM-SSO" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-IAM-MFA-I;INC-SRV-SEC-IAM-MFA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-IAM-PERMISOS-I;INC-SRV-SEC-IAM-PERMISOS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-IAM-ROL-I;INC-SRV-SEC-IAM-ROL" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-IAM-BLOCKED-I;INC-SRV-SEC-IAM-BLOCKED" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-PROXY-BLOQUEO-I;INC-SRV-SEC-PROXY-BLOQUEO" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-PROXY-AUTENTICACION-I;INC-SRV-SEC-PROXY-AUTENTICACION" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-PROXY-SITES-I;INC-SRV-SEC-PROXY-SITES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-PROXY-CATEGORIZACION-I;INC-SRV-SEC-PROXY-CATEGORIZACION" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-PROXY-CERTIFICADOS-I;INC-SRV-SEC-PROXY-CERTIFICADOS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-SSO-R;REQ-SRV-CLOUD-AZ-SSO" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-NETWORK-R;REQ-SRV-CLOUD-AZ-NETWORK" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-NSG-R;REQ-SRV-CLOUD-AZ-NSG" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-VM-R;REQ-SRV-CLOUD-AZ-VM" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-STORAGE-R;REQ-SRV-CLOUD-AZ-STORAGE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-VAULT-R;REQ-SRV-CLOUD-AZ-VAULT" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-APPGATEWAY-R;REQ-SRV-CLOUD-AZ-APPGATEWAY" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-VPN-R;REQ-SRV-CLOUD-AZ-VPN" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-DNS-R;REQ-SRV-CLOUD-AZ-DNS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AZ-AUTOSCALE-R;REQ-SRV-CLOUD-AZ-AUTOSCALE" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-IAM-R;REQ-SRV-CLOUD-AWS-IAM" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-S3-R;REQ-SRV-CLOUD-AWS-S3" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-EC2-R;REQ-SRV-CLOUD-AWS-EC2" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-ROUTE53-R;REQ-SRV-CLOUD-AWS-ROUTE53" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-RDS-R;REQ-SRV-CLOUD-AWS-RDS" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-VPC-R;REQ-SRV-CLOUD-AWS-VPC" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-SG-R;REQ-SRV-CLOUD-AWS-SG" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-LB-R;REQ-SRV-CLOUD-AWS-LB" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-CLOUDWATCH-R;REQ-SRV-CLOUD-AWS-CLOUDWATCH" },
  { "val": None },
  { "val": " ajuste o mejora sobre el servicio.;CLOUD-AWS-LAMBDA-R;REQ-SRV-CLOUD-AWS-LAMBDA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–CONECTIVIDAD-I;INC-SRV-SEC-FW–CONECTIVIDAD" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–PERFORMANCE-I;INC-SRV-SEC-FW–PERFORMANCE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–CPU-I;INC-SRV-SEC-FW–CPU" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–MEMORIA-I;INC-SRV-SEC-FW–MEMORIA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–LATENCIA-I;INC-SRV-SEC-FW–LATENCIA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–RULES-I;INC-SRV-SEC-FW–RULES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–NAT-I;INC-SRV-SEC-FW–NAT" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–VPN-I;INC-SRV-SEC-FW–VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–LOGS-I;INC-SRV-SEC-FW–LOGS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW–ROUTING-I;INC-SRV-SEC-FW–ROUTING" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-RULES-I;INC-SRV-SEC-FW-RULES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-DENY-I;INC-SRV-SEC-FW-DENY" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-ACL-I;INC-SRV-SEC-FW-ACL" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-VPN-I;INC-SRV-SEC-FW-VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-HA-I;INC-SRV-SEC-FW-HA" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FW-UPDATES-I;INC-SRV-SEC-FW-UPDATES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ASA–CONECTIVIDAD-I;INC-SRV-SEC-ASA–CONECTIVIDAD" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ASA–VPN-I;INC-SRV-SEC-ASA–VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ASA–NAT-I;INC-SRV-SEC-ASA–NAT" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ASA–PERFORMANCE-I;INC-SRV-SEC-ASA–PERFORMANCE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FTD–CONECTIVIDAD-I;INC-SRV-SEC-FTD–CONECTIVIDAD" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FTD–ACCESSCONTROL-I;INC-SRV-SEC-FTD–ACCESSCONTROL" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FTD–SNORT-I;INC-SRV-SEC-FTD–SNORT" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FTD–VPN-I;INC-SRV-SEC-FTD–VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-MERAKI–FW-I;INC-SRV-SEC-MERAKI–FW" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-MERAKI–VPN-I;INC-SRV-SEC-MERAKI–VPN" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-MERAKI–PERF-I;INC-SRV-SEC-MERAKI–PERF" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ASA-VULNERABILIDADES-I;INC-SRV-SEC-ASA-VULNERABILIDADES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-FTD-VULNERABILIDADES-I;INC-SRV-SEC-FTD-VULNERABILIDADES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-MERAKI-VULNERABILIDADES-I;INC-SRV-SEC-MERAKI-VULNERABILIDADES" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-AUTENTICACION-I;INC-SRV-SEC-ISE-AUTENTICACION" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-AUTORICING-I;INC-SRV-SEC-ISE-AUTORICING" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-PERFORMANCE-I;INC-SRV-SEC-ISE-PERFORMANCE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-CERTIFICADOS-I;INC-SRV-SEC-ISE-CERTIFICADOS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-POLICYSET-I;INC-SRV-SEC-ISE-POLICYSET" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-AD-CONNECT-I;INC-SRV-SEC-ISE-AD-CONNECT" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-RADIUS-I;INC-SRV-SEC-ISE-RADIUS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-TACACS-I;INC-SRV-SEC-ISE-TACACS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-PXE-I;INC-SRV-SEC-ISE-PXE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-ISE-PROVISIONING-I;INC-SRV-SEC-ISE-PROVISIONING" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–CONECTIVIDAD-I;INC-SRV-SEC-VPN–CONECTIVIDAD" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–CERTIFICADO-I;INC-SRV-SEC-VPN–CERTIFICADO" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–CLIENTE-I;INC-SRV-SEC-VPN–CLIENTE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–LICENCIAS-I;INC-SRV-SEC-VPN–LICENCIAS" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–TIMEOUT-I;INC-SRV-SEC-VPN–TIMEOUT" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–PERFORMANCE-I;INC-SRV-SEC-VPN–PERFORMANCE" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–AUTENTICACION-I;INC-SRV-SEC-VPN–AUTENTICACION" },
  { "val": " degradación o riesgo del servicio y requiere restauración.;SEC-VPN–RECHAZO-I;INC-SRV-SEC-VPN–RECHAZO" },
  { "val": " ajuste o mejora sobre el servicio.;NET-SW-UPGRADE-R;REQ-SRV-NET-SW-UPGRADE" },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-RMA-R;REQ-SRV-DC-ACI-RMA" },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-UPGRADE-R;REQ-SRV-DC-ACI-UPGRADE" },
  { "val": " ajuste o mejora sobre el servicio.;DC-ACI-BUG-R;REQ-SRV-DC-ACI-BUG" },
  { "val": " ajuste o mejora sobre el servicio.;DC-NXOS-CONF-R;REQ-SRV-DC-NXOS-CONF" }
]

services_map = {}
incidents_list = []
requests_list = []

# Icon Mapping
category_icons = {
  'NET': 'Network',
  'SEC': 'Shield',
  'DC': 'Server',
  'ENT': 'Globe',
  'CLOUD': 'Cloud'
}

service_definitions = {
  # NET
  'NET-SW': {'name': 'Switching & LAN', 'cat': 'Conectividad y Red'},
  'NET-WL': {'name': 'Wireless / WiFi', 'cat': 'Conectividad y Red'},
  # SEC
  'SEC-FW': {'name': 'Firewall Services', 'cat': 'Seguridad'},
  'SEC-ASA': {'name': 'Cisco ASA Security', 'cat': 'Seguridad'},
  'SEC-FTD': {'name': 'Firepower Threats', 'cat': 'Seguridad'},
  'SEC-MERAKI': {'name': 'Meraki Security', 'cat': 'Seguridad'},
  'SEC-VPN': {'name': 'VPN Services', 'cat': 'Seguridad'},
  'SEC-AMP': {'name': 'Malware Protection', 'cat': 'Seguridad'},
  'SEC-IAM': {'name': 'Identity Access Management', 'cat': 'Seguridad'},
  'SEC-PROXY': {'name': 'Web Proxy Filters', 'cat': 'Seguridad'},
  'SEC-ISE': {'name': 'Identity Service Engine', 'cat': 'Seguridad'},
  # ENT
  'ENT-ISE': {'name': 'Identity Services (ISE)', 'cat': 'Servicios Empresariales'},
  'ENT-AD': {'name': 'Active Directory', 'cat': 'Servicios Empresariales'},
  'ENT-MAIL': {'name': 'Mail / Exchange', 'cat': 'Servicios Empresariales'},
  # DC
  'DC-ACI': {'name': 'Data Center ACI', 'cat': 'Infraestructura DC'},
  'DC-VM': {'name': 'Virtualization / VMware', 'cat': 'Infraestructura DC'},
  'DC-SAN': {'name': 'Storage SAN', 'cat': 'Infraestructura DC'},
  'DC-NAS': {'name': 'Storage NAS', 'cat': 'Infraestructura DC'},
  'DC-NXOS': {'name': 'Nexus Switching', 'cat': 'Infraestructura DC'},
  # CLOUD
  'CLOUD-AZ': {'name': 'Azure Cloud', 'cat': 'Cloud & Access'},
  'CLOUD-AWS': {'name': 'AWS Cloud', 'cat': 'Cloud & Access'}
}

processed_ids = set()

for item in raw_data:
  if not item or not item.get('val'):
    continue
  
  parts = item['val'].split(';')
  if len(parts) < 3:
    continue
    
  desc_raw = parts[0].strip()
  short_code = parts[1].strip()
  full_id = parts[2].strip()
  
  # Deduplicate
  if full_id in processed_ids:
    continue
  processed_ids.add(full_id)
  
  # Extract Service Code (e.g. NET-SW)
  # Format usually: PRE-SVC-ITEM-TYPE
  # NET-SW-L2-R -> NET-SW
  # SEC-MERAKI-FW-I -> SEC-MERAKI
  
  # Heuristic to find Service Key
  service_key = None
  
  # Try matching known prefixes
  best_match_key = ''
  for key in service_definitions.keys():
    if short_code.startswith(key):
      if len(key) > len(best_match_key):
        best_match_key = key
  
  if best_match_key:
    service_key = best_match_key
  else:
    # Fallback: take first two parts e.g. ABC-XYZ
    id_parts = short_code.split('-')
    if len(id_parts) >= 2:
      service_key = f"{id_parts[0]}-{id_parts[1]}"
    else:
      service_key = "OTHER"

  # Add Service if new
  if service_key not in services_map:
    # Use definition or generic
    def_data = service_definitions.get(service_key, {'name': service_key, 'cat': 'Otros Servicios'})
    services_map[service_key] = {
      'id': service_key,
      'category': def_data['cat'],
      'name': def_data['name'],
      'icon': category_icons.get(service_key.split('-')[0], 'Layers')
    }

  # Generate Scenario Name
  # short_code: NET-SW-L2-R
  # remove service key prefix: L2-R
  # remove suffix R or I
  name_part = short_code.replace(service_key + '-', '').replace('-R', '').replace('-I', '')
  # Replace dashes with spaces and title case
  nice_name = name_part.replace('-', ' ').title()
  
  # Categorize Incident vs Request
  record = {
    'id': full_id,
    'name': nice_name,
    'serviceId': service_key
  }
  
  if full_id.startswith('REQ'):
    record['complexity'] = 'Medium'
    record['time'] = '4h'
    requests_list.append(record)
  else:
    # Incident
    record['priority'] = 'P2' # Default
    incidents_list.append(record)

# Generate JS Output
services_arr = list(services_map.values())

js_content = f"""export const SERVICE_CATALOG = {json.dumps(services_arr, indent=4)};

export const INCIDENT_SCENARIOS = {json.dumps(incidents_list, indent=4)};

export const REQUEST_SCENARIOS = {json.dumps(requests_list, indent=4)};
"""

with open('src/data/catalogData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Successfully updated src/data/catalogData.js")
