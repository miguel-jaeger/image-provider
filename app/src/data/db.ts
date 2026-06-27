import type { Image } from '../types/image'

const STORAGE_KEY = 'image-provider-images'

const SEED_DATA: Image[] = [
  {
    id: 1,
    title: 'Harbor Horizon',
    description: 'Ultra-modern minimalist office space featuring sustainable materials and ergonomic design elements for creative teams.',
    category: 'Architecture',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvQD9VVrvBf9zhmuva2VpTe4BMK1JVcL8WO1XKSBBNhU6XM8eYDQLSthoP0D5jLTByn5x9w9UgFx-60kyArV1So6ULKFs8z1pTADn8WeJMMFwnqqflXXrUpXrZoT2tsryAw_KjPHvbWkfo_MOHzMtfjD3AkYmmf_xscgLC5ZjsvJJpA5ea70B8kCvAPXfP0tGBG-mIs5lItDpW6xDqHLRCaemagPbZOR6yTFoiCkqomaV1hHcEAcTn_MDAK0I_ZKOVk4ppv4vnF_bi',
    cdnLink: 'cdn.imageprovider.com/arch/office_01',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Summit Blue',
    description: 'Panoramic mountain range view captured at sunrise with atmospheric depth and natural color grading.',
    category: 'Nature',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7XMvd-HFvOBNEZIBKmyLm9Pm3D9q5E4crJnfyGJJ0Ta8I296IqLqMmuErE9Ns1-HOYLhu21zTEzjYgxgcILPeCXlBzIGDecJy23re3FW5Zl7PjeW6poh-6tD3gKeo6IHm0OJGtUmaVr7XAZdtoK4vixIG2VvZxkTXnz8QKnoagOz9_G6GYEtlkWcM6DIWgCw8tsaIIrRMBUADLBnYQ2upfN6COTcrvjcvScO6Mikhr682Mab7XZ_wU28P3_CSYfyqTjRbZM67QZL',
    cdnLink: 'cdn.imageprovider.com/nat/summit_blue',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Core Processing',
    description: 'Macro shot of a next-generation semiconductor with integrated neural processing units and light-pathways.',
    category: 'Technology',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6BO6yyNTEV0AwR_I7ThtoXmlf_FhJIFsYHb7hFkDtnuNTkPeRfLvKvRHCloyO9hyth4-KlhzK3TMYx6z54u5a9pI-ILtWEVdyCXo4KQsx9MlEaplRGGICRmQ19soDofJqo0ju3vl643r96cujMMLoMu1CPh7ViIr_OVsi1APZyKd891d9s6SIs8mR5mlBhsMHNeDisOmGkjlMnb0tqSozli_dvxxpwhfjO3M2mD0qZdBHtR3_ZwUkGLoVXSXPdCnu9bfnoKIdW7vM',
    cdnLink: 'cdn.imageprovider.com/tech/core_nx',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Team Sync',
    description: 'Collaborative team workshop session in a modern daylight studio setting, highlighting creative synergy.',
    category: 'People',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTiConYnXUL923ke5AgBwy4RIb1egX_vLAbiwFfFDUdeALrKBIwIyisedpvxTYQC05uzazZ2--xWf-GhRoXkTNMbuJEAoCWOLq1FZCKjVh6-atWEU8AqiwWH0F3cb7chTSydQHdkBxX0PDyFqjsajh5l4yWFJMUoMIavdXFJaiCkTcAljCL2FjQ7gLqf45Ev6SSPnC9Um7RL0AaGTAjy6PFkre5iMRRethCF-Sa8oDnXGR3U0INw3pMqPOT_PSyH5YDlX5UH8VcAGl',
    cdnLink: 'cdn.imageprovider.com/people/team_sync',
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Fluid Flow',
    description: 'Generative 3D fluid art representing dynamic data streams and algorithmic fluidity for digital interfaces.',
    category: 'Abstract',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtzwJiChoDLoquOwnT9iCvvSyvjWV_auqRHFPZfZ-0NTiI_xWsMw2Zk-20Cp2Pu5U575ljvL-tz5j5nYb0leaU_j-42iydX_MTv3R5mfZvMCocpMVFXWmB6xLFWkDcRWVisXUSaaENOGq7sx92KXDtIrie5Ku4ZX5yIBfidqfsmRusDj8R3TbexfTFSp0_qF9EWxsdCT1t86XY954-mnf2MpYTQQOZP9STu6FkSW8IztXywpM80O5MyFYqRgQlyqGNwl_ee1ofV59O',
    cdnLink: 'cdn.imageprovider.com/gen/fluid_flow',
    createdAt: new Date().toISOString()
  }
]

function loadImages(): Image[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))
  return SEED_DATA
}

function saveImages(images: Image[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
}

export function getAllImages(): Image[] {
  return loadImages().sort((a, b) => b.id - a.id)
}

export function getImagesByCategory(category: string): Image[] {
  return loadImages()
    .filter((img) => img.category === category)
    .sort((a, b) => b.id - a.id)
}

export function addImage(image: Omit<Image, 'id'>): Image {
  const images = loadImages()
  const newId = images.length > 0 ? Math.max(...images.map((i) => i.id)) + 1 : 1
  const newImage: Image = { ...image, id: newId }
  images.push(newImage)
  saveImages(images)
  return newImage
}

export function deleteImage(id: number): boolean {
  const images = loadImages()
  const filtered = images.filter((img) => img.id !== id)
  if (filtered.length === images.length) return false
  saveImages(filtered)
  return true
}
