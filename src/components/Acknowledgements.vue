<script setup>
import { ref } from 'vue'

// 定义列表
const links = ref([
    {
        text: 'specialist003', 
        href: 'https://github.com/okhmanyuk-ev',
        gradient: 'from-sky-400 to-purple-500'
    },
    {
        text: 'caiiiycuk', 
        href: 'https://www.youtube.com/caiiiycuk',
        gradient: 'from-green-400 to-emerald-500'
    },
    {
        text: 'SerGen', 
        href: 'https://t.me/ser_var',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        text: 'aliya',
        href: 'https://github.com/AliYa-chen',
        gradient: 'from-emerald-400 to-blue-400'
    }
])

// 如果想随机渐变，可以用函数生成
function randomGradient() {
    const colors = ['sky', 'indigo', 'purple', 'pink', 'green', 'emerald', 'blue', 'violet']
    const pick = () => colors[Math.floor(Math.random() * colors.length)]
    const from = pick(), via = pick(), to = pick()
    return `from-${from}-400 via-${via}-400 to-${to}-500`
}

// 可以动态生成 gradient
links.value.forEach(item => {
    if (item.href && !item.gradient) item.gradient = randomGradient()
})
</script>

<template>
    <ul class="grid grid-cols-2 gap-x-6 gap-y-3 font-black text-white/25 sm:grid-cols-3">
        <li v-for="link in links" :key="link.text">
            <template v-if="link.href">
                <a :href="link.href" target="_blank" class="group relative inline-block whitespace-nowrap">
                    <span class="text-white/25 transition-opacity duration-500 group-hover:opacity-0">
                        {{ link.text }}
                    </span>
                    <span
                        class="absolute inset-0 whitespace-nowrap bg-clip-text text-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        :class="`bg-linear-to-r ${link.gradient}`">
                        {{ link.text }}
                    </span>
                </a>
            </template>
            <template v-else>
                {{ link.text }}
            </template>
        </li>
    </ul>
</template>
