export const SERVICE_CATALOG = [
    {
        "id": "NET-SW",
        "category": "Conectividad y Red",
        "name": "Switching & LAN",
        "icon": "Network"
    },
    {
        "id": "NET-WL",
        "category": "Conectividad y Red",
        "name": "Wireless / WiFi",
        "icon": "Network"
    },
    {
        "id": "ENT-ISE",
        "category": "Servicios Empresariales",
        "name": "Identity Services (ISE)",
        "icon": "Globe"
    },
    {
        "id": "ENT-AD",
        "category": "Servicios Empresariales",
        "name": "Active Directory",
        "icon": "Globe"
    },
    {
        "id": "ENT-MAIL",
        "category": "Servicios Empresariales",
        "name": "Mail / Exchange",
        "icon": "Globe"
    },
    {
        "id": "DC-ACI",
        "category": "Infraestructura DC",
        "name": "Data Center ACI",
        "icon": "Server"
    },
    {
        "id": "DC-VM",
        "category": "Infraestructura DC",
        "name": "Virtualization / VMware",
        "icon": "Server"
    },
    {
        "id": "DC-SAN",
        "category": "Infraestructura DC",
        "name": "Storage SAN",
        "icon": "Server"
    },
    {
        "id": "DC-NAS",
        "category": "Infraestructura DC",
        "name": "Storage NAS",
        "icon": "Server"
    },
    {
        "id": "SEC-FW",
        "category": "Seguridad",
        "name": "Firewall Services",
        "icon": "Shield"
    },
    {
        "id": "SEC-AMP",
        "category": "Seguridad",
        "name": "Malware Protection",
        "icon": "Shield"
    },
    {
        "id": "SEC-IAM",
        "category": "Seguridad",
        "name": "Identity Access Management",
        "icon": "Shield"
    },
    {
        "id": "SEC-PROXY",
        "category": "Seguridad",
        "name": "Web Proxy Filters",
        "icon": "Shield"
    },
    {
        "id": "CLOUD-AZ",
        "category": "Cloud & Access",
        "name": "Azure Cloud",
        "icon": "Cloud"
    },
    {
        "id": "CLOUD-AWS",
        "category": "Cloud & Access",
        "name": "AWS Cloud",
        "icon": "Cloud"
    },
    {
        "id": "SEC-ASA",
        "category": "Seguridad",
        "name": "Cisco ASA Security",
        "icon": "Shield"
    },
    {
        "id": "SEC-FTD",
        "category": "Seguridad",
        "name": "Firepower Threats",
        "icon": "Shield"
    },
    {
        "id": "SEC-MERAKI",
        "category": "Seguridad",
        "name": "Meraki Security",
        "icon": "Shield"
    },
    {
        "id": "SEC-ISE",
        "category": "Seguridad",
        "name": "Identity Service Engine",
        "icon": "Shield"
    },
    {
        "id": "SEC-VPN",
        "category": "Seguridad",
        "name": "VPN Services",
        "icon": "Shield"
    },
    {
        "id": "DC-NXOS",
        "category": "Infraestructura DC",
        "name": "Nexus Switching",
        "icon": "Server"
    }
];

export const INCIDENT_SCENARIOS = [
    {
        "id": "INC-SRV-SEC-FW-RULES",
        "name": "Rules",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW-DENY",
        "name": "Deny",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW-ACL",
        "name": "Acl",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW-VPN",
        "name": "Vpn",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW-UPDATES",
        "name": "Updates",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-AMP-MALWARE",
        "name": "Malware",
        "serviceId": "SEC-AMP",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-AMP-POLICY",
        "name": "Policy",
        "serviceId": "SEC-AMP",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-AMP-CUARENTENA",
        "name": "Cuarentena",
        "serviceId": "SEC-AMP",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-AMP-NUBE",
        "name": "Nube",
        "serviceId": "SEC-AMP",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-AMP-PERFORMANCE",
        "name": "Performance",
        "serviceId": "SEC-AMP",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-IAM-SSO",
        "name": "Sso",
        "serviceId": "SEC-IAM",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-IAM-MFA",
        "name": "Mfa",
        "serviceId": "SEC-IAM",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-IAM-PERMISOS",
        "name": "Permisos",
        "serviceId": "SEC-IAM",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-IAM-ROL",
        "name": "Rol",
        "serviceId": "SEC-IAM",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-IAM-BLOCKED",
        "name": "Blocked",
        "serviceId": "SEC-IAM",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-PROXY-BLOQUEO",
        "name": "Bloqueo",
        "serviceId": "SEC-PROXY",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-PROXY-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "SEC-PROXY",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-PROXY-SITES",
        "name": "Sites",
        "serviceId": "SEC-PROXY",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-PROXY-CATEGORIZACION",
        "name": "Categorizacion",
        "serviceId": "SEC-PROXY",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-PROXY-CERTIFICADOS",
        "name": "Certificados",
        "serviceId": "SEC-PROXY",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013CONECTIVIDAD",
        "name": "Sec Fw\u2013Conectividad",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013PERFORMANCE",
        "name": "Sec Fw\u2013Performance",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013CPU",
        "name": "Sec Fw\u2013Cpu",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013MEMORIA",
        "name": "Sec Fw\u2013Memoria",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013LATENCIA",
        "name": "Sec Fw\u2013Latencia",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013RULES",
        "name": "Sec Fw\u2013Rules",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013NAT",
        "name": "Sec Fw\u2013Nat",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013VPN",
        "name": "Sec Fw\u2013Vpn",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013LOGS",
        "name": "Sec Fw\u2013Logs",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW\u2013ROUTING",
        "name": "Sec Fw\u2013Routing",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FW-HA",
        "name": "Ha",
        "serviceId": "SEC-FW",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ASA\u2013CONECTIVIDAD",
        "name": "Sec Asa\u2013Conectividad",
        "serviceId": "SEC-ASA",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ASA\u2013VPN",
        "name": "Sec Asa\u2013Vpn",
        "serviceId": "SEC-ASA",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ASA\u2013NAT",
        "name": "Sec Asa\u2013Nat",
        "serviceId": "SEC-ASA",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ASA\u2013PERFORMANCE",
        "name": "Sec Asa\u2013Performance",
        "serviceId": "SEC-ASA",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FTD\u2013CONECTIVIDAD",
        "name": "Sec Ftd\u2013Conectividad",
        "serviceId": "SEC-FTD",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FTD\u2013ACCESSCONTROL",
        "name": "Sec Ftd\u2013Accesscontrol",
        "serviceId": "SEC-FTD",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FTD\u2013SNORT",
        "name": "Sec Ftd\u2013Snort",
        "serviceId": "SEC-FTD",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FTD\u2013VPN",
        "name": "Sec Ftd\u2013Vpn",
        "serviceId": "SEC-FTD",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-MERAKI\u2013FW",
        "name": "Sec Meraki\u2013Fw",
        "serviceId": "SEC-MERAKI",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-MERAKI\u2013VPN",
        "name": "Sec Meraki\u2013Vpn",
        "serviceId": "SEC-MERAKI",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-MERAKI\u2013PERF",
        "name": "Sec Meraki\u2013Perf",
        "serviceId": "SEC-MERAKI",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ASA-VULNERABILIDADES",
        "name": "Vulnerabilidades",
        "serviceId": "SEC-ASA",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-FTD-VULNERABILIDADES",
        "name": "Vulnerabilidades",
        "serviceId": "SEC-FTD",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-MERAKI-VULNERABILIDADES",
        "name": "Vulnerabilidades",
        "serviceId": "SEC-MERAKI",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-AUTORICING",
        "name": "Autoricing",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-PERFORMANCE",
        "name": "Performance",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-CERTIFICADOS",
        "name": "Certificados",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-POLICYSET",
        "name": "Policyset",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-AD-CONNECT",
        "name": "Ad Connect",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-RADIUS",
        "name": "Radius",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-TACACS",
        "name": "Tacacs",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-PXE",
        "name": "Pxe",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-ISE-PROVISIONING",
        "name": "Provisioning",
        "serviceId": "SEC-ISE",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013CONECTIVIDAD",
        "name": "Sec Vpn\u2013Conectividad",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013CERTIFICADO",
        "name": "Sec Vpn\u2013Certificado",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013CLIENTE",
        "name": "Sec Vpn\u2013Cliente",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013LICENCIAS",
        "name": "Sec Vpn\u2013Licencias",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013TIMEOUT",
        "name": "Sec Vpn\u2013Timeout",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013PERFORMANCE",
        "name": "Sec Vpn\u2013Performance",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013AUTENTICACION",
        "name": "Sec Vpn\u2013Autenticacion",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    },
    {
        "id": "INC-SRV-SEC-VPN\u2013RECHAZO",
        "name": "Sec Vpn\u2013Rechazo",
        "serviceId": "SEC-VPN",
        "priority": "P2"
    }
];

export const REQUEST_SCENARIOS = [
    {
        "id": "REQ-SRV-NET-SW-L2",
        "name": "L2",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-STP",
        "name": "Stp",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-BPDU",
        "name": "Bpdu",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-MACFLAP",
        "name": "Macflap",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-VLAN",
        "name": "Vlan",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-TRUNK",
        "name": "Trunk",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-PORTCHANNEL",
        "name": "Portchannel",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-DUPLEX",
        "name": "Duplex",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-POE",
        "name": "Poe",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-HARDWARE",
        "name": "Hardware",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-CONECTIVIDAD",
        "name": "Conectividad",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-INTERFERENCIA",
        "name": "Interferencia",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-ROAMING",
        "name": "Roaming",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-CAPACIDAD",
        "name": "Capacidad",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-CONTROLLER",
        "name": "Controller",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-SSID",
        "name": "Ssid",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-APDOWN",
        "name": "Apdown",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-CHANNEL",
        "name": "Channel",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-WL-FIRMWARE",
        "name": "Firmware",
        "serviceId": "NET-WL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-AUTORICING",
        "name": "Autoricing",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-PERFORMANCE",
        "name": "Performance",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-CERTIFICADOS",
        "name": "Certificados",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-POLICYSET",
        "name": "Policyset",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-AD-CONNECT",
        "name": "Ad Connect",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-RADIUS",
        "name": "Radius",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-TACACS",
        "name": "Tacacs",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-PXE",
        "name": "Pxe",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-ISE-PROVISIONING",
        "name": "Provisioning",
        "serviceId": "ENT-ISE",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-REPLICACION",
        "name": "Replicacion",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-CUENTAS",
        "name": "Cuentas",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-POLICIES",
        "name": "Policies",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-GPO",
        "name": "Gpo",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-LDAP",
        "name": "Ldap",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-DOMAINJOIN",
        "name": "Domainjoin",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-DNS",
        "name": "Dns",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-SSO",
        "name": "Sso",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-AD-TIME",
        "name": "Time",
        "serviceId": "ENT-AD",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-MAIL-ENTREGA",
        "name": "Entrega",
        "serviceId": "ENT-MAIL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-MAIL-SPAM",
        "name": "Spam",
        "serviceId": "ENT-MAIL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-MAIL-BLACKLIST",
        "name": "Blacklist",
        "serviceId": "ENT-MAIL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-MAIL-AUTENTICACION",
        "name": "Autenticacion",
        "serviceId": "ENT-MAIL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-ENT-MAIL-CUOTAS",
        "name": "Cuotas",
        "serviceId": "ENT-MAIL",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-CONNECTIVITY",
        "name": "Connectivity",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-CONF",
        "name": "Conf",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-EPG",
        "name": "Epg",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-BRIDGEDOMAIN",
        "name": "Bridgedomain",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-CONTRACTS",
        "name": "Contracts",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-FABRICHEALTH",
        "name": "Fabrichealth",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-LEAFDOWN",
        "name": "Leafdown",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-SPINECONN",
        "name": "Spineconn",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-TEP",
        "name": "Tep",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-POLICIES",
        "name": "Policies",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-PERFORMANCE",
        "name": "Performance",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-CPU",
        "name": "Cpu",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-MEMORIA",
        "name": "Memoria",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-STORAGE",
        "name": "Storage",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-RED",
        "name": "Red",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-MIGRATION",
        "name": "Migration",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-SNAPSHOT",
        "name": "Snapshot",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-RESOURCEPOOL",
        "name": "Resourcepool",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-DNS",
        "name": "Dns",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-VM-DRS",
        "name": "Drs",
        "serviceId": "DC-VM",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-LATENCIA",
        "name": "Latencia",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-DISCO",
        "name": "Disco",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-DEGRADADO",
        "name": "Degradado",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-CACHE",
        "name": "Cache",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-BACKUP",
        "name": "Backup",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-NAS-CUOTAS",
        "name": "Cuotas",
        "serviceId": "DC-NAS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-NAS-PERFORMANCE",
        "name": "Performance",
        "serviceId": "DC-NAS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-SAN-FIRMWARE",
        "name": "Firmware",
        "serviceId": "DC-SAN",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-SSO",
        "name": "Sso",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-NETWORK",
        "name": "Network",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-NSG",
        "name": "Nsg",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-VM",
        "name": "Vm",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-STORAGE",
        "name": "Storage",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-VAULT",
        "name": "Vault",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-APPGATEWAY",
        "name": "Appgateway",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-VPN",
        "name": "Vpn",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-DNS",
        "name": "Dns",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AZ-AUTOSCALE",
        "name": "Autoscale",
        "serviceId": "CLOUD-AZ",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-IAM",
        "name": "Iam",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-S3",
        "name": "S3",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-EC2",
        "name": "Ec2",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-ROUTE53",
        "name": "Route53",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-RDS",
        "name": "Rds",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-VPC",
        "name": "Vpc",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-SG",
        "name": "Sg",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-LB",
        "name": "Lb",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-CLOUDWATCH",
        "name": "Cloudwatch",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-CLOUD-AWS-LAMBDA",
        "name": "Lambda",
        "serviceId": "CLOUD-AWS",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-NET-SW-UPGRADE",
        "name": "Upgrade",
        "serviceId": "NET-SW",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-RMA",
        "name": "Rma",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-UPGRADE",
        "name": "Upgrade",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-ACI-BUG",
        "name": "Bug",
        "serviceId": "DC-ACI",
        "complexity": "Medium",
        "time": "4h"
    },
    {
        "id": "REQ-SRV-DC-NXOS-CONF",
        "name": "Conf",
        "serviceId": "DC-NXOS",
        "complexity": "Medium",
        "time": "4h"
    }
];
