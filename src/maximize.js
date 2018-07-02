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
		
		// Sort the items by value, only once
		this.my_values_ascending = []
		// Fill it with item numbers
		for (let i = 0; i < this.values.length; i++)
			this.my_values_ascending.push(i);
		
		this.log(`Counts: ${this.counts}`);
		this.log(`My values: ${this.values}`);
		
		this.my_values_ascending.sort(function(a,b)
		{
			return values[a] - values[b];
			
		});
		
		this.log(this.my_values_ascending);
		
		this.last_offer = counts.slice(); // copy of the counts
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
        o = this.last_offer; // Take the last offer
        for (let i = 0; i<o.length; i++)
        {
			// Decrease the least valued item by one
            if (o[this.my_values_ascending[i]] != 0)
			{
                o[this.my_values_ascending[i]]--;
				this.log(`Offer: ${o}`);
				return o
			}
        }
        return o;
    }
};
