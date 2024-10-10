# Manuale Utente: Trading Webhook Endpoint

## Indice
1. [Introduzione](#introduzione)
2. [Parametri del cBot](#parametri-del-cbot)
3. [Configurazione del Server](#configurazione-del-server)
4. [Comandi HTTP](#comandi-http)
5. [Esempi di Utilizzo](#esempi-di-utilizzo)
6. [Risoluzione dei Problemi](#risoluzione-dei-problemi)

## Introduzione

Il Trading Webhook Endpoint è un potente cBot per cTrader che consente di eseguire operazioni di trading tramite richieste HTTP. Questo strumento è ideale per integrare strategie di trading automatizzate, segnali esterni o per controllare il tuo trading da piattaforme di terze parti come TradingView.

## Parametri del cBot

### Sezione "Identity"

1. **Product Info**: Informazioni sul prodotto (default: https://ctrader.guru/)
   - Questo campo mostra le informazioni sul prodotto e non può essere modificato.

2. **Label**: Etichetta per identificare le operazioni (default: TWE)
   - Usato per etichettare le operazioni aperte dal cBot. Se lasciato vuoto, verrà utilizzato "TWE".
   - Accetta solo caratteri alfanumerici.

3. **License**: Chiave di licenza del prodotto
   - Inserisci qui la tua chiave di licenza per attivare il cBot.

### Sezione "Server"

4. **Address**: Indirizzo del server (default: http://0.0.0.0)
   - Specifica l'indirizzo IP e la porta su cui il server webhook ascolterà le richieste.
   - Formato: http://[indirizzo IP]:[porta]
   - IMPORTANTE: L'indirizzo di ascolto è quello del PC su cui è in esecuzione cTrader con il cBot.

### Sezione "API"

5. **Key**: Chiave API per autenticare le richieste (default: webhook)
   - Questa chiave verrà utilizzata nell'URL delle richieste HTTP per autenticare le chiamate al webhook.
   - Accetta solo caratteri alfanumerici.

6. **Interprets parameters as strings**: Interpretazione dei parametri come stringhe (default: false)
   - Se impostato su true, i parametri numerici verranno interpretati come stringhe, simile al comportamento di TradingView.

### Sezione "Symbols"

7. **Prefix**: Prefisso da aggiungere ai simboli
   - Se il tuo broker utilizza prefissi per i simboli, inseriscili qui.

8. **Suffix**: Suffisso da aggiungere ai simboli
   - Se il tuo broker utilizza suffissi per i simboli, inseriscili qui.

## Configurazione del Server

Una volta avviato, il cBot creerà un server webhook all'indirizzo specificato nel parametro "Address". Le richieste HTTP dovranno essere inviate a questo indirizzo, utilizzando la chiave API specificata.

### Importante: Configurazione di Rete

Per rendere il server webhook accessibile da Internet, è necessario configurare correttamente la propria rete:

1. **Port Forwarding**: È necessario configurare il port forwarding sul proprio router per la porta 80 (HTTP). Questa operazione inoltrerà le richieste in arrivo sulla porta 80 al PC su cui è in esecuzione cTrader con il cBot.

2. **Indirizzo IP**: 
   - Se si dispone di un indirizzo IP pubblico statico, è possibile utilizzarlo direttamente.
   - Se l'indirizzo IP è dinamico (cambia periodicamente), si consiglia di utilizzare un servizio DDNS (Dynamic DNS) come No-IP. Questi servizi forniscono un nome di dominio che si aggiorna automaticamente quando cambia l'indirizzo IP.

3. **Sicurezza**: Assicurarsi di utilizzare una chiave API robusta e di mantenere aggiornato il sistema operativo e cTrader per garantire la sicurezza del server webhook.

Esempio di URL del webhook:
```
http://[tuo-dominio-noip].ddns.net/[API Key]
```
o
```
http://[tuo-ip-pubblico]/[API Key]
```

NOTA: Il cBot utilizza la porta 80 (HTTP) per impostazione predefinita. Non sono supportate altre porte per garantire la massima compatibilità e semplicità di configurazione.

## Comandi HTTP

Il Trading Webhook Endpoint accetta richieste POST con payload JSON. Ecco i comandi disponibili:

1. **buy**: Apre una posizione long
2. **sell**: Apre una posizione short
3. **close**: Chiude una posizione specifica o tutte le posizioni
4. **edit**: Modifica lo stop loss o il take profit di una posizione
5. **tp1**: Chiude 1/3 della posizione
6. **tp2**: Chiude 1/2 della posizione rimanente
7. **tp3**: Chiude completamente la posizione
8. **closeBuy**: Chiude tutte le posizioni long
9. **closeSell**: Chiude tutte le posizioni short

### Struttura del Payload JSON

```json
{
  "command": "string",
  "id": "string",
  "symbol": "string",
  "volume": number,
  "lots": number,
  "slPrice": number,
  "tpPrice": number,
  "slPips": number,
  "tpPips": number
}
```

- **command**: Il comando da eseguire (obbligatorio)
- **id**: Identificatore univoco per la posizione (opzionale)
- **symbol**: Il simbolo su cui operare (obbligatorio per apertura posizioni)
- **volume**: Volume in unità (alternativo a lots)
- **lots**: Volume in lotti (alternativo a volume)
- **slPrice**: Prezzo dello stop loss
- **tpPrice**: Prezzo del take profit
- **slPips**: Stop loss in pips
- **tpPips**: Take profit in pips

## Esempi di Utilizzo

### Apertura di una posizione long

```json
{
  "command": "buy",
  "symbol": "EURUSD",
  "volume": 10000,
  "slPips": 20,
  "tpPips": 50
}
```

### Chiusura di una posizione specifica

```json
{
  "command": "close",
  "id": "12345"
}
```

### Modifica dello stop loss e take profit

```json
{
  "command": "edit",
  "id": "12345",
  "slPrice": 1.0850,
  "tpPrice": 1.0950
}
```

## Risoluzione dei Problemi

1. **Il server non si avvia**: Verifica che l'indirizzo IP e la porta specificati siano corretti e non in uso da altre applicazioni.

2. **Le richieste vengono rifiutate**: Assicurati di utilizzare la chiave API corretta nell'URL del webhook.

3. **I simboli non vengono riconosciuti**: Controlla di aver impostato correttamente i prefissi e suffissi dei simboli, se necessario per il tuo broker.

4. **Le operazioni non vengono eseguite**: Verifica che il cBot abbia i permessi necessari nel tuo account cTrader e che ci sia sufficiente margine disponibile.

5. **Non riesco ad accedere al webhook da Internet**: 
   - Verifica che il port forwarding sia configurato correttamente sul tuo router.
   - Assicurati che il firewall del tuo PC non stia bloccando le connessioni in entrata sulla porta 80.
   - Se usi un servizio DDNS, controlla che il tuo indirizzo IP sia stato aggiornato correttamente.

Per ulteriore assistenza, non esitare a contattare il supporto su https://ctrader.guru/.
