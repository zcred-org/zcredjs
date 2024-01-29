# zcred for ethereum

Library provides zcred implementations for mina

## Wallet Adapter

### EIP1193 wallet adapter

```typescript
import {IEIP1193Provider, EIP1193WalletAdapter} from "@zcredjs/ethereum"
const injected = "ethereum" in window && (window.ethereum as IEIP1193Provider);
if (!injected) throw new Error(`No window.ethereum available`);
const walletAdapter = new EIP1193WalletAdapter(injected);

```
