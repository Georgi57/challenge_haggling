'use strict'; /*jslint node:true*/

module.exports = class Agent {
    constructor(me, counts, values, max_rounds, log){
        this.counts = counts;
        this.values = values;
        this.rounds = max_rounds;
        this.log = log;
        this.total = 0;
        for (let i = 0; i<counts.length; i++)
            this.total += counts[i]*values[i];
    }
    offer(o){
        this.log(`${this.rounds} rounds left`);
        this.rounds--;
		
		// Decision whether to accept
        if (o)
        {
			// Count the amount you'll get
            let sum = 0;
            for (let i = 0; i<o.length; i++)
                sum += this.values[i]*o[i];
			
			// If the sum is at least half - accept
            if (sum>=this.total/2)
                return;
        }
		
		// If do no accept - counter offer
        o = this.counts.slice(); // copy of the counts
        for (let i = 0; i<o.length; i++)
        {
			// If there is no value to the item - discard
            if (!this.values[i])
                o[i] = 0;
        }
        return o;
    }
};
