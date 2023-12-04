<script lang="ts">
	import XIcon from '~icons/feather/x';

	export let tags: string[] = [];
	export let placeholder = '';
	export let doesEnterSubmit = false;
	export let name: string | null = null;
	let inputValue = '';

	function addTag(name: string) {
		if (name.trim() === '') return;

		tags.push(name);
		tags = tags;

		inputValue = '';
	}

	function removeTag(index = -1) {
		if (index === -1) inputValue = tags.at(index) ?? '';

		tags.splice(index, 1);
		tags = tags;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (inputValue === undefined) return;

		switch (e.key) {
			case 'Enter': //enter key
				e.preventDefault();
				addTag(inputValue);
				break;
			case ',': //comma key
				e.preventDefault();
				addTag(inputValue);
				break;
			case ' ': //spacebar
				if (doesEnterSubmit) {
					e.preventDefault();
					addTag(inputValue);
				}
				break;
			case 'Backspace': //backspace key
				if (inputValue.trim() === '' && (e.target as HTMLInputElement).selectionStart === 0) {
					e.preventDefault();
					removeTag();
				}
				break;
		}
	}
</script>

<div class="flex flex-wrap items-center w-full gap-1.5">
	{#each tags as tag, index}
		<button
			type="button"
			on:click={() => removeTag(index)}
			class="px-1.5 py-0.5 gap-1 flex items-center rounded-md cursor-pointer bg-slate-700 hover:bg-opacity-50 transition-colors outline-amber-400 outline-2 focus-visible:outline"
		>
			{tag}
			<XIcon class="text-xs text-slate-400" />
		</button>
	{/each}

	<div class="flex-1">
		<input
			type="text"
			{name}
			placeholder={tags.length === 0 ? placeholder : ''}
			bind:value={inputValue}
			on:keydown={handleKeyDown}
			class="w-full min-w-[60px] bg-transparent placeholder:text-slate-600 focus:placeholder:text-transparent focus-visible:outline-none"
		/>
	</div>
</div>
