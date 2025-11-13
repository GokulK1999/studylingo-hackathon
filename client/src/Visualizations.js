import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Visualizations.css';

function Visualizations({ originalText, translations }) {
  const wordFreqRef = useRef(null);
  const languageCompRef = useRef(null);
  const complexityRef = useRef(null);

  // Word Frequency Chart
useEffect(() => {
    if (!originalText || !wordFreqRef.current) return;
  
    // Clear previous chart
    d3.select(wordFreqRef.current).selectAll('*').remove();
  
    // Process text to get word frequency
    const words = originalText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words
  
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  
    // Get top 8 words
    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  
    console.log('Top words:', topWords); // Debug log
  
    if (topWords.length === 0) {
      // Show message if no data
      d3.select(wordFreqRef.current)
        .append('div')
        .style('text-align', 'center')
        .style('padding', '40px')
        .style('color', '#999')
        .text('Enter longer text to see word frequency');
      return;
    }
  
    // Chart dimensions - FIXED
    const margin = { top: 40, right: 20, bottom: 80, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    // Create SVG
    const svg = d3.select(wordFreqRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('background', '#fafafa')
      .style('border-radius', '8px')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(topWords.map(d => d[0]))
      .padding(0.2);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(topWords, d => d[1]) * 1.2]) // Add 20% padding
      .range([height, 0]);
  
    // Color scale
    const colorScale = d3.scaleLinear()
      .domain([0, topWords.length - 1])
      .range(['#667eea', '#764ba2']);
  
    // Add bars
    svg.selectAll('.bar')
      .data(topWords)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d[0]))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', (d, i) => colorScale(i))
      .attr('rx', 4)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr('y', d => y(d[1]))
      .attr('height', d => height - y(d[1]));
  
    // Add values on top of bars
    svg.selectAll('.label')
      .data(topWords)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d[0]) + x.bandwidth() / 2)
      .attr('y', d => y(d[1]) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#667eea')
      .style('opacity', 0)
      .text(d => d[1])
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style('opacity', 1);
  
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-8px')
      .attr('dy', '2px');
  
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('font-size', '12px');
  
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 15)
      .attr('x', 0 - (height / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Frequency');
  
  }, [originalText]);

  // Language Comparison Chart
  useEffect(() => {
    if (!translations || !languageCompRef.current) return;

    // Clear previous chart
    d3.select(languageCompRef.current).selectAll('*').remove();

    const languageNames = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
    };

    // Count words in each translation
    const data = Object.entries(translations).map(([lang, text]) => ({
      language: languageNames[lang] || lang,
      wordCount: text.split(/\s+/).length
    }));

    // Chart dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(languageCompRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.language))
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.wordCount) * 1.1])
      .range([height, 0]);

    // Add bars
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.language))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#764ba2')
      .attr('rx', 6)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('y', d => y(d.wordCount))
      .attr('height', d => height - y(d.wordCount));

    // Add values
    svg.selectAll('.value')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'value')
      .attr('x', d => x(d.language) + x.bandwidth() / 2)
      .attr('y', d => y(d.wordCount) - 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#764ba2')
      .style('opacity', 0)
      .text(d => `${d.wordCount} words`)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .style('opacity', 1);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('font-size', '14px');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('font-size', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Word Count by Language');

  }, [translations]);

  // Text Complexity Gauge
  useEffect(() => {
    if (!originalText || !complexityRef.current) return;

    // Clear previous chart
    d3.select(complexityRef.current).selectAll('*').remove();

    // Calculate complexity (simple metric: average word length)
    const words = originalText.split(/\s+/).filter(w => w.length > 0);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Normalize to 0-100 scale (assuming 3-10 char average)
    const complexity = Math.min(100, Math.max(0, ((avgWordLength - 3) / 7) * 100));

    // Gauge dimensions
    const width = 300;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 20;

    const svg = d3.select(complexityRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height - 30})`);

    // Create arc for gauge background
    const arcBackground = d3.arc()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Create arc for gauge fill
    const arcFill = d3.arc()
      .innerRadius(radius - 30)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (Math.PI * complexity / 100));

    // Background arc
    svg.append('path')
      .attr('d', arcBackground)
      .style('fill', '#e9ecef');

    // Animated fill arc
    svg.append('path')
      .datum({ endAngle: -Math.PI / 2 })
      .style('fill', complexity < 33 ? '#28a745' : complexity < 66 ? '#ffc107' : '#dc3545')
      .attr('d', arcFill)
      .transition()
      .duration(1500)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(d.endAngle, -Math.PI / 2 + (Math.PI * complexity / 100));
        return function(t) {
          d.endAngle = interpolate(t);
          return d3.arc()
            .innerRadius(radius - 30)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(d.endAngle)();
        };
      });

    // Add percentage text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -10)
      .style('font-size', '32px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('0%')
      .transition()
      .duration(1500)
      .tween('text', function() {
        const i = d3.interpolate(0, complexity);
        return function(t) {
          this.textContent = Math.round(i(t)) + '%';
        };
      });

    // Add label
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 20)
      .style('font-size', '14px')
      .style('fill', '#666')
      .text('Text Complexity');

  }, [originalText]);

  return (
    <div className="visualizations-container">
      <h2>📊 Analytics & Visualizations</h2>
      
      <div className="viz-grid">
        <div className="viz-card">
          <h3>🔤 Most Common Words</h3>
          <div ref={wordFreqRef} className="chart-container"></div>
        </div>

        <div className="viz-card">
          <h3>🌍 Translation Length Comparison</h3>
          <div ref={languageCompRef} className="chart-container"></div>
        </div>

        <div className="viz-card">
          <h3>📈 Text Complexity</h3>
          <div ref={complexityRef} className="chart-container complexity-gauge"></div>
          <p className="complexity-desc">
            Based on average word length and sentence structure
          </p>
        </div>
      </div>
    </div>
  );
}

export default Visualizations;