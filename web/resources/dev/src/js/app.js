import './classes/Modal.js'
import './classes/Select.js'
import './classes/Fancybox.js'
import './classes/Mask.js'
import './classes/Slider.js'
import './classes/Alert.js'
import './classes/Tabs.js'
import './classes/SetSizes.js'
import './classes/CookieAccept.js'
import './classes/ToTop.js'
import './classes/Rating.js'
// import './classes/TaskForm.js'

import Alpine from 'alpinejs'
window.Alpine = Alpine

import tasks from './modules/tasks.js'

Alpine.data('tasks', tasks);
Alpine.start()


