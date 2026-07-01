# Enregistrements DNS

## Domaine telehappy.fr

| Type | Nom | Valeur |
|------|-----|--------|
| A | telehappy.fr | <IP_SERVEUR> |
| A | www.telehappy.fr | <IP_SERVEUR> |
| AAAA | telehappy.fr | <IPV6_SERVEUR> |
| AAAA | www.telehappy.fr | <IPV6_SERVEUR> |
| CAA | telehappy.fr | 0 issue "letsencrypt.org" |

## Domaine telehappy.org

| Type | Nom | Valeur |
|------|-----|--------|
| A | telehappy.org | <IP_SERVEUR> |
| A | www.telehappy.org | <IP_SERVEUR> |

## Domaine happyserv.fr

| Type | Nom | Valeur |
|------|-----|--------|
| A | happyserv.fr | <IP_SERVEUR> |
| A | www.happyserv.fr | <IP_SERVEUR> |
| A | api.happyserv.fr | <IP_SERVEUR> |
| CNAME | portal.happyserv.fr | happyserv.fr |
| MX | happyserv.fr | 10 mail.happyserv.fr |
| TXT | happyserv.fr | v=spf1 ip4:<IP_SERVEUR> -all |

## Sous-domaines

| Sous-domaine | Cible | Service |
|-------------|-------|---------|
| api.happyserv.fr | API | API REST |
| portal.happyserv.fr | Portal | Dashboard |
| telehappy.fr | Site | Site vitrine |
| www.telehappy.fr | Site | Redirection |
