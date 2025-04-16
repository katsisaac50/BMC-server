export class BandwidthMonitor {
    private connectionTests: Array<{
      timestamp: Date;
      downloadSpeed: number; // Mbps
      latency: number; // ms
      packetLoss: number; // percentage
    }> = [];
  
    constructor(private consultationId: string) {}
  
    async runInitialTest(): Promise<void> {
      const testResults = await this.performNetworkTest();
      this.connectionTests.push(testResults);
    }
  
    async performNetworkTest() {
      // Simulate network test - in real app, use WebRTC stats or dedicated test
      const testResult = {
        timestamp: new Date(),
        downloadSpeed: Math.random() * 10 + 5, // 5-15 Mbps
        latency: Math.random() * 100 + 50, // 50-150 ms
        packetLoss: Math.random() * 5 // 0-5%
      };
      
      return testResult;
    }
  
    getRecommendedQuality(): 'low' | 'medium' | 'high' {
      const latestTest = this.connectionTests.slice(-1)[0];
      if (!latestTest) return 'medium';
  
      if (latestTest.downloadSpeed < 3 || latestTest.latency > 200) {
        return 'low';
      } else if (latestTest.downloadSpeed < 6 || latestTest.latency > 100) {
        return 'medium';
      } else {
        return 'high';
      }
    }
  
    async monitorConnection() {
      setInterval(async () => {
        const testResult = await this.performNetworkTest();
        this.connectionTests.push(testResult);
        
        // Keep only last 5 tests
        if (this.connectionTests.length > 5) {
          this.connectionTests.shift();
        }
      }, 30000); // Test every 30 seconds
    }
  }