<template>
    <v-main>
        <v-app-bar>
            <v-toolbar-title>Tomestone Planner</v-toolbar-title>
        </v-app-bar>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="caps.total" label="Tomestone Cap"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="caps.weekly" label="Weekly Cap"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-text>
                            <v-row>
                                <v-container>
                                    <v-data-table
                                        @click:row="openShoppingMenu"
                                        :headers="headers"
                                        :items="weeks.current"
                                        :hide-default-footer="true"
                                        disable-pagination
                                        rows-per-page-item="-1"
                                    >
                                        <template v-slot:item.end="{ item }">
                                            <div :class="{
                                                'red--text': item.end < 0,
                                                'text--darken-2': item.end < 0,
                                            }">{{ item.end }}</div>
                                        </template>

                                        <template v-slot:item.items="{ item }">
                                            <v-chip
                                                v-for="(data,index) in item.items"
                                                :key="index"
                                                v-text="data.name"
                                            ></v-chip>
                                        </template>
                                    </v-data-table>
                                </v-container>

                                <v-col cols="12">
                                    <v-btn color="primary" @click="addWeek">
                                        Add Week
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

        <v-dialog
            v-model="modal.open"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card v-if="modal.week">
                <v-toolbar>
                    <v-toolbar-title v-text="'Week - ' +  modal.week.week"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn @click="modal.open = false">Close</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-contaner>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-row>
                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="12" v-text="'Start - ' +  modal.week.start"></v-col>
                                            <v-col cols="12" v-text="'Available - ' +  modal.week.available"></v-col>
                                            <v-col cols="12" v-text="'Spent - ' +  modal.week.spent"></v-col>
                                            <v-col cols="12" v-text="'End - ' +  modal.week.end"></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <hr>
                                <v-row>
                                    <v-col cols="12" v-for="(item,index) in modal.week.items" :key="index">
                                        <v-btn @click="remove(modal.week, index)">Remove</v-btn>
                                        &nbsp; {{ item.name }} - {{ item.value }}
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-row>
                                    <v-col cols="12">Items</v-col>
                                    <v-col cols="12" v-for="(item,index) in costs" :key="index">
                                        <v-btn
                                            @click="buy(modal.week, item)"
                                            :disabled="(modal.week.available - modal.week.spent) < item.value"
                                        >
                                            Buy
                                        </v-btn>
                                        &nbsp; {{ item.name }} - {{ item.value }}
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-contaner>
                </v-card-text>
            </v-card>

        </v-dialog>
        </v-container>
    </v-main>
</template>

<script>
export default {
    data: () => ({
        modal: {
            open: false,
            week: null,
        },
        caps: {
            total: 2000,
            weekly: 450,
        },
        headers: [
            {
                text: "Week #",
                sortable: false,
                value: "week"
            },
            {
                text: "Start",
                sortable: false,
                value: "start"
            },
            {
                text: "Available",
                sortable: false,
                value: "available"
            },
            {
                text: "Spent",
                sortable: false,
                value: "spent"
            },
            {
                text: "End",
                sortable: false,
                value: "end"
            },
            {
                text: "Items",
                sortable: false,
                value: "items"
            }
        ],
        weeks: {
            default: [
                {
                    week: 0,
                    start: 0,
                    available: 0,
                    spent: 0,
                    items: [],
                    end: 0,
                }
            ],
            current: [],
        },
        costs: {
            weapon: {
                value: 1000,
                name: "Weapon",
            },
            head: {
                value: 495,
                name: "Head",
            },
            body: {
                value: 825,
                name: "Body",
            },
            hands: {
                value: 495,
                name: "Hands",
            },
            waist: {
                value: 375,
                name: "Waist",
            },
            legs: {
                value: 825,
                name: "Legs",
            },
            feet: {
                value: 495,
                name: "Feet",
            },
            earrings: {
                value: 375,
                name: "Earrings",
            },
            necklace: {
                value: 375,
                name: "Necklace",
            },
            bracelet: {
                value: 375,
                name: "Bracelet",
            },
            ring: {
                value: 375,
                name: "Ring",
            },
        }
    }),
    methods: {
        addWeek() {
            let current = this.weeks.current;
            let lastWeek = current[current.length - 1];
            let newWeek = JSON.parse(JSON.stringify(this.weeks.default[0]));
            newWeek.week = lastWeek.week + 1;
            newWeek.start = lastWeek.end;
            newWeek.available = Math.min(newWeek.start + this.caps.weekly, this.caps.total);
            newWeek.end = Math.min(newWeek.available - newWeek.spent, this.caps.total);

            this.weeks.current.push(newWeek);
        },
        openShoppingMenu(item, table) {
            if (item.week === 0) {
                return;
            }

            this.modal.week = item;
            this.modal.open = true;
        },
        buy(week, item) {
            week.items.push(item);
            this.recalculate();
        },
        remove(week, index) {
            week.items.splice(index);
            this.recalculate();
        },
        recalculate() {
            for (let index in this.weeks.current) {
                let week = this.weeks.current[index];
                if (week.week === 0) {
                    continue;
                }

                week.start = this.weeks.current[index - 1].end;
                week.available = Math.min(week.start + this.caps.weekly, this.caps.total);
                week.spent = 0;
                for (let item of week.items) {
                    week.spent += item.value;
                }

                week.end = week.available - week.spent;
            }
        }
    },
    mounted() {
        this.weeks.current = this.weeks.default;
    }
};
</script>