import { color, composeColors } from '../../core/color.js'

export class Spinner {
	private current: number
	private intervalId: NodeJS.Timeout | null
	private message: string | null
	private text: string
	private readonly decoration: (text: string) => string
	private readonly symbols: string[]
	private readonly interval: number

	constructor(text: string, decoration = composeColors(color.bold, color.yellow)) {
		this.current = 0
		this.decoration = decoration
		this.intervalId = null
		this.symbols = ['▖', '▘', '▝', '▗']
		this.interval = 120
		this.text = text

		if (!text.includes('{{spinner}}')) {
			this.text = '{{spinner}} ' + text
		}
	}

	private clear(moveUp = false) {
		// If there's no message, don't do anything
		if (!this.message) {
			return
		}

		// Loop through each line of the message and clear it
		const lines = this.message.split('\n')
		lines.forEach((line, index) => {
			process.stdout.write('\r' + ' '.repeat(line?.length))
			
			// Move up by default, unless it's the last line (then use moveUp param)
			if (moveUp || index < lines.length - 1) {
				process.stdout.write('\x1b[1A')
			}
		})
	}

	private renderSpinner() {
		return this.decoration(this.symbols[this.current])
	}

	public setText(text: string) {
		this.text = text

		if (!text.includes('{{spinner}}')) {
			this.text = '{{spinner}} ' + text
		}
	}

	public start() {
		this.intervalId = setInterval(() => {
			const spinner = this.renderSpinner()
			this.clear()

			this.message = this.text.replaceAll('{{spinner}}', spinner)
			process.stdout.write('\r' + this.message)
			this.current = (this.current + 1) % this.symbols.length
		}, this.interval)
	}

	public stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
			this.clear(true)
			this.message = null
		}
	}
}
