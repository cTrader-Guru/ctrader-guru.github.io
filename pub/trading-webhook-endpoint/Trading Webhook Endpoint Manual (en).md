# User Manual: Trading Webhook Endpoint

## Table of Contents
1. [Introduction](#introduction)
2. [cBot Parameters](#cbot-parameters)
3. [Server Configuration](#server-configuration)
4. [HTTP Commands](#http-commands)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)

## Introduction

The Trading Webhook Endpoint is a powerful cBot for cTrader that allows you to execute trading operations via HTTP requests. This tool is ideal for integrating automated trading strategies, external signals, or controlling your trading from third-party platforms like TradingView.

## cBot Parameters

### "Identity" Section

1. **Product Info**: Product information (default: https://ctrader.guru/)
   - This field displays product information and cannot be modified.

2. **Label**: Label to identify operations (default: TWE)
   - Used to label operations opened by the cBot. If left empty, "TWE" will be used.
   - Accepts only alphanumeric characters.

3. **License**: Product license key
   - Enter your license key here to activate the cBot.

### "Server" Section

4. **Address**: Server address (default: http://0.0.0.0)
   - Specifies the IP address and port on which the webhook server will listen for requests.
   - Format: http://[IP address]:[port]
   - IMPORTANT: The listening address is that of the PC running cTrader with the cBot.

### "API" Section

5. **Key**: API key to authenticate requests (default: webhook)
   - This key will be used in the URL of HTTP requests to authenticate webhook calls.
   - Accepts only alphanumeric characters.

6. **Interprets parameters as strings**: Interpret parameters as strings (default: false)
   - If set to true, numeric parameters will be interpreted as strings, similar to TradingView's behavior.

### "Symbols" Section

7. **Prefix**: Prefix to add to symbols
   - If your broker uses prefixes for symbols, enter them here.

8. **Suffix**: Suffix to add to symbols
   - If your broker uses suffixes for symbols, enter them here.

## Server Configuration

Once started, the cBot will create a webhook server at the address specified in the "Address" parameter. HTTP requests must be sent to this address, using the specified API key.

### Important: Network Configuration

To make the webhook server accessible from the Internet, you need to properly configure your network:

1. **Port Forwarding**: You need to configure port forwarding on your router for port 80 (HTTP). This operation will forward incoming requests on port 80 to the PC running cTrader with the cBot.

2. **IP Address**: 
   - If you have a static public IP address, you can use it directly.
   - If the IP address is dynamic (changes periodically), it is recommended to use a DDNS (Dynamic DNS) service such as No-IP. These services provide a domain name that automatically updates when the IP address changes.

3. **Security**: Make sure to use a robust API key and keep your operating system and cTrader updated to ensure the security of the webhook server.

Example of webhook URL:
```
http://[your-noip-domain].ddns.net/[API Key]
```
or
```
http://[your-public-ip]/[API Key]
```

NOTE: The cBot uses port 80 (HTTP) by default. Other ports are not supported to ensure maximum compatibility and simplicity of configuration.

## HTTP Commands

The Trading Webhook Endpoint accepts POST requests with JSON payload. Here are the available commands:

1. **buy**: Opens a long position
2. **sell**: Opens a short position
3. **close**: Closes a specific position or all positions
4. **edit**: Modifies the stop loss or take profit of a position
5. **tp1**: Closes 1/3 of the position
6. **tp2**: Closes 1/2 of the remaining position
7. **tp3**: Completely closes the position
8. **closeBuy**: Closes all long positions
9. **closeSell**: Closes all short positions

### JSON Payload Structure

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

- **command**: The command to execute (required)
- **id**: Unique identifier for the position (optional)
- **symbol**: The symbol to operate on (required for opening positions)
- **volume**: Volume in units (alternative to lots)
- **lots**: Volume in lots (alternative to volume)
- **slPrice**: Stop loss price
- **tpPrice**: Take profit price
- **slPips**: Stop loss in pips
- **tpPips**: Take profit in pips

## Usage Examples

### Opening a long position

```json
{
  "command": "buy",
  "symbol": "EURUSD",
  "volume": 10000,
  "slPips": 20,
  "tpPips": 50
}
```

### Closing a specific position

```json
{
  "command": "close",
  "id": "12345"
}
```

### Modifying stop loss and take profit

```json
{
  "command": "edit",
  "id": "12345",
  "slPrice": 1.0850,
  "tpPrice": 1.0950
}
```

## Troubleshooting

1. **The server doesn't start**: Verify that the specified IP address and port are correct and not in use by other applications.

2. **Requests are rejected**: Make sure you're using the correct API key in the webhook URL.

3. **Symbols are not recognized**: Check that you have correctly set the symbol prefixes and suffixes, if necessary for your broker.

4. **Operations are not executed**: Verify that the cBot has the necessary permissions in your cTrader account and that there is sufficient margin available.

5. **I can't access the webhook from the Internet**: 
   - Verify that port forwarding is correctly configured on your router.
   - Make sure your PC's firewall is not blocking incoming connections on port 80.
   - If you're using a DDNS service, check that your IP address has been updated correctly.

For further assistance, don't hesitate to contact support at https://ctrader.guru/.
