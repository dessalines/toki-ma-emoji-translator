import autosize from "autosize";
import { ChangeEvent, Component, linkEvent } from "inferno";

interface Props {
	// 0: tokima word
	// 1: emoji
	// 4: short def
	// 5: long def
	//
	dictionary: unknown[];
}

enum Type {
	Text,
	Emoji,
}

interface State {
	text: string;
	emoji: string;
	lastChanged: Type;
}

export class TextConverter extends Component<Props, State> {
	constructor(props: Props, context: unknown) {
		super(props, context);
		this.state = { text: "", emoji: "", lastChanged: Type.Text };
	}

	componentDidMount(): void {
		const ta = document.querySelectorAll("textarea");
		autosize(ta);
	}

	render() {
		return (
			<>
				<div className="row">
					<div className="col-12 col-6-md">
						<textarea
							value={this.state.text}
							rows={10}
							onInput={linkEvent(this, this.handleUpdateText)}
							placeholder={"Text..."}
						/>
					</div>
					<div className="col-12 col-6-md">
						<textarea
							value={this.state.emoji}
							rows={10}
							onInput={linkEvent(this, this.handleUpdateEmoji)}
							placeholder={"Emojis..."}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-12 is-center">
						<button
							className="button outline"
							onClick={linkEvent(this, this.handleConvert)}
						>
							Convert
						</button>
					</div>
				</div>
			</>
		);
	}

	handleUpdateText(i: TextConverter, event: ChangeEvent<HTMLTextAreaElement>) {
		i.setState({ text: event.target.value, lastChanged: Type.Text });
	}

	handleUpdateEmoji(i: TextConverter, event: ChangeEvent<HTMLTextAreaElement>) {
		i.setState({ emoji: event.target.value, lastChanged: Type.Emoji });
	}

	handleConvert(i: TextConverter) {
		if (i.state.lastChanged == Type.Text) {
			i.handleConvertToEmoji(i);
		} else {
			i.handleConvertToText(i);
		}
	}

	handleConvertToEmoji(i: TextConverter) {
		const wordToEmojiMap = new Map<RegExp, string>();
		wordToEmojiMap.set(/,/g, "🔸");
		wordToEmojiMap.set(/\./g, "🔶");
		wordToEmojiMap.set(/!/g, "🔶");

		// Sort by longest so that words like po dont get replaced before pona
		for (const row of i.props.dictionary.sort(
			(a, b) => b[0].length - a[0].length
		)) {
			const regex = new RegExp(row[0], "g");
			wordToEmojiMap.set(regex, row[1]);
		}

		const output = replaceWords(i.state.text.toLowerCase(), wordToEmojiMap);

		i.setState({ emoji: output });
		i.updateAutosize();
	}

	updateAutosize() {
		const ta = document.querySelectorAll("textarea");
		autosize.update(ta);
	}

	handleConvertToText(i: TextConverter) {
		const emojiToWordMap = new Map<RegExp, string>();
		// emojiToWordMap.set(/➖/, ".");
		emojiToWordMap.set(/🔸/gu, ",");
		emojiToWordMap.set(/🔶/gu, ".");

		for (const row of i.props.dictionary.sort(
			(a, b) => b[1].length - a[1].length
		)) {
			try {
				const emoji = row[1];
				const regex = new RegExp(row[1], "gu");
				if (emoji !== "") {
					emojiToWordMap.set(regex, row[0]);
				}
			} catch (e) {
				console.error(e);
			}
		}

		const output = replaceWords(i.state.emoji, emojiToWordMap);
		i.setState({ text: output });
		i.updateAutosize();
	}
}

function replaceWords(text: string, emojiMap: Map<RegExp, string>): string {
	let str = text;
	for (const [k, v] of emojiMap.entries()) {
		str = str.replace(k, v);
	}
	return str;
}
