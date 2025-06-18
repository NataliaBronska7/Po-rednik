function app() {
  return {
    suppliers: null,
    receivers: null,
    suppliersRange: [],
    receiversRange: [],
    costs: [],
    purchasePrices: [],
    sellingPrices: [],
    supplierSupply: [],
    receiverDemand: [],
    unitProfits: [],
    transportPlan: [],
    totalCost: 0,
    totalRevenue: 0,
    profit: 0,
    resultsVisible: false,
    showTables: false,
    errorMessage: '',
    canExport: false, // NOWA ZMIENNA

    generateTables() {
      if (!this.suppliers || !this.receivers || this.suppliers < 1 || this.receivers < 1) {
        this.errorMessage = 'Liczba dostawców i odbiorców musi być większa od 0.';
        this.showTables = false;
        return;
      }

      this.errorMessage = '';
      this.suppliersRange = Array.from({ length: this.suppliers }, (_, i) => i + 1);
      this.receiversRange = Array.from({ length: this.receivers }, (_, i) => i + 1);

      this.costs = Array.from({ length: this.suppliers }, () =>
        Array.from({ length: this.receivers }, () => 0)
      );
      this.purchasePrices = Array(this.suppliers).fill(0);
      this.supplierSupply = Array(this.suppliers).fill(0);
      this.sellingPrices = Array(this.receivers).fill(0);
      this.receiverDemand = Array(this.receivers).fill(0);
      this.unitProfits = [];
      this.transportPlan = Array.from({ length: this.suppliers }, () =>
        Array.from({ length: this.receivers }, () => 0)
      );
      this.resultsVisible = false;
      this.showTables = true;
      this.canExport = false; // Reset eksportu przy generowaniu tabel
    },

    validateData() {
      for (let i = 0; i < this.suppliers; i++) {
        if (this.supplierSupply[i] < 0) return `Podaż dostawcy ${i + 1} nie może być ujemna.`;
        if (this.purchasePrices[i] < 0) return `Cena zakupu dostawcy ${i + 1} nie może być ujemna.`;
        for (let j = 0; j < this.receivers; j++) {
          if (this.costs[i][j] < 0) return `Koszt transportu od dostawcy ${i + 1} do odbiorcy ${j + 1} nie może być ujemny.`;
        }
      }
      for (let j = 0; j < this.receivers; j++) {
        if (this.receiverDemand[j] < 0) return `Popyt odbiorcy ${j + 1} nie może być ujemny.`;
        if (this.sellingPrices[j] < 0) return `Cena sprzedaży odbiorcy ${j + 1} nie może być ujemna.`;
      }
      return '';
    },

    calculate() {
      const validationError = this.validateData();
      if (validationError) {
        this.errorMessage = validationError;
        this.resultsVisible = false;
        this.canExport = false; // BLOKUJ eksport przy błędzie
        return;
      }

      this.errorMessage = '';
      this.unitProfits = [];
      this.transportPlan = Array.from({ length: this.suppliers }, () =>
        Array.from({ length: this.receivers }, () => 0)
      );
      this.totalCost = 0;
      this.totalRevenue = 0;
      this.profit = 0;

      for (let i = 0; i < this.suppliers; i++) {
        let row = [];
        for (let j = 0; j < this.receivers; j++) {
          const profit = this.sellingPrices[j] - this.costs[i][j] - this.purchasePrices[i];
          row.push(profit);
        }
        this.unitProfits.push(row);
      }

      let profitList = [];
      for (let i = 0; i < this.suppliers; i++) {
        for (let j = 0; j < this.receivers; j++) {
          profitList.push({ supplier: i, receiver: j, profit: this.unitProfits[i][j] });
        }
      }

      profitList.sort((a, b) => b.profit - a.profit);

      let remainingSupply = [...this.supplierSupply];
      let remainingDemand = [...this.receiverDemand];

      for (let { supplier, receiver, profit } of profitList) {
        if (profit > 0 && remainingSupply[supplier] > 0 && remainingDemand[receiver] > 0) {
          const amount = Math.min(remainingSupply[supplier], remainingDemand[receiver]);
          if (amount > 0) {
            this.transportPlan[supplier][receiver] = amount;
            remainingSupply[supplier] -= amount;
            remainingDemand[receiver] -= amount;
            this.totalCost += amount * (this.costs[supplier][receiver] + this.purchasePrices[supplier]);
            this.totalRevenue += amount * this.sellingPrices[receiver];
          }
        }
      }

      const totalSupply = this.supplierSupply.reduce((a, b) => a + b, 0);
      const totalDemand = this.receiverDemand.reduce((a, b) => a + b, 0);
     
      this.profit = this.totalRevenue - this.totalCost;
      this.resultsVisible = true;
      this.canExport = true; // ODBLOKUJ eksport po sukcesie
    },

    exportData() {
      const data = {
        suppliers: this.suppliers,
        receivers: this.receivers,
        costs: this.costs,
        purchasePrices: this.purchasePrices,
        sellingPrices: this.sellingPrices,
        supplierSupply: this.supplierSupply,
        receiverDemand: this.receiverDemand
      };
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'dane_posrednika.json';
      a.click();
      URL.revokeObjectURL(url);
    },

    importData(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.suppliers = data.suppliers;
          this.receivers = data.receivers;
          this.generateTables();
          this.costs = data.costs;
          this.purchasePrices = data.purchasePrices;
          this.sellingPrices = data.sellingPrices;
          this.supplierSupply = data.supplierSupply;
          this.receiverDemand = data.receiverDemand;
          this.showTables = true;
          this.canExport = false; // Import = dane nieprzeliczone jeszcze
        } catch (error) {
          this.errorMessage = 'Błąd podczas importu danych: nieprawidłowy format pliku.';
        }
      };
      reader.readAsText(file);
    }
  };
}

window.app = app;
