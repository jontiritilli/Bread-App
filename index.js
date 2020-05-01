const ratios = {
  grams: {
    grams: 1,
    tsp: 5,
    tbsp: 15,
    cup: 128,
  },
  yeast: {
    dry: {
      dry: 1,
      fresh: 2.5,
      instant: 1 / 1.25,
    },
    fresh: {
      dry: 1 / 2.5,
      fresh: 1,
      instant: 1 / 3,
    },
    instant: {
      dry: 1 / 0.75,
      fresh: 1 / 0.33,
      instant: 1,
    },
  },
};

$(document).ready(function () {
  addHandlers();
});
function addHandlers() {
  $("#btnConvert").on("click", handleConversion);
}

function handleConversion() {
  const conversionAmount = $("#volumeConverterInput").val();
  const isFraction = conversionAmount.indexOf("/") > -1;
  let value = conversionAmount;
  if (isFraction) {
    const numerator = value.substring(0, value.indexOf("/"));
    const denominator = value.substring(value.indexOf("/") + 1, value.length);
    value = numerator / denominator;
  }
  const input = {
    value,
    unitTo: $("#unitToSelector").val(),
    unit: $("#unitFromSelector").val(),
  };
  const result = convert(input);
  const yeastInput = {
    value: result.data.value,
    from: $("#yeastFromSelector").val(),
    to: $("#yeastToSelector").val(),
  };
  const yeast = convertYeast(yeastInput);
  $("#result").text(
    `${conversionAmount} ${input.unit} equals ${result.data.value} ${result.data.unit}`
  );
  $("#yeast").text(
    `${conversionAmount} ${input.unit} of ${yeastInput.from} yeast equals ${yeast.data.value} ${input.unitTo} of ${yeastInput.to} yeast`
  );
}

const convertYeast = (input = {}) => {
  // validation
  if (typeof input != "object" || !input.value || !input.from || !input.to) {
    return {
      input,
      error: {
        message: "something went wrong",
      },
    };
  }
  const { from, to, value } = input;
  const ratio = ratios.yeast[from];
  const result = {
    input,
    data: {
      value: Math.round(value * ratio[to] * 2) / 2,
      unit: to,
    },
  };
  return result;
};

const convert = (input = {}) => {
  // validation
  if (typeof input != "object" || !input.value || !input.unit) {
    return {
      input,
      error: {
        message: "something went wrong",
      },
    };
  }
  if (!input.unitTo) {
    input.unitTo = "grams";
  }
  const result = {
    input,
  };
  // do work
  const { unit, unitTo, value } = input;
  ratio = ratios[unitTo];
  result.data = {
    unit: unitTo,
    value: ratio[unit] * value,
  };
  console.log(result);
  return result;
};
